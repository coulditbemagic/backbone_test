﻿$(function () {

    function setCookie (name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    }




    var AppState = Backbone.Model.extend({
        defaults: {
            username: "",
            state: "start"
        }
    });
    var appState = new AppState();
    
    var UserNameModel = Backbone.Model.extend({ // Модель пользователя
        defaults: {
            "Name": "",
            "Password": ""
        }
    });
    
    var AdminsCollection = Backbone.Collection.extend({ // Коллекция пользователей
    
        model: UserNameModel,
    
        checkUser: function (username, password) { // Проверка пользователя
            var findResult = this.find(function (user) { return (user.get("Name") == username && user.get("Password") == password) });
            return findResult != null;
        }
    
    });
    
    var Admins = new AdminsCollection([ // Админы, которым показываем контент
        { Name: "admin@admin.ru", Password: "pass2" },
        { Name: "admin", Password: "pass2" }
    ]);
    var Controller = Backbone.Router.extend({
        routes: {
            "": "start", // Пустой hash-тэг
            "!/": "start", // Начальная страница
            "!/content": "content", // Блок удачи
            "!/error": "error" // Блок ошибки
        },
    
        start: function () {
            appState.set({ state: "start" });
        },
    
        content: function () {
            appState.set({ state: "success" });
        },
    
        error: function () {
            appState.set({ state: "error" });
        }
    });
    
    var controller = new Controller(); // Создаём контроллер


    var Block = Backbone.View.extend({
        el: $("#block"), // DOM элемент login-content-error
    
        templates: { // Шаблоны на разное состояние
            "start": _.template($('#login').html()),
            "success": _.template($('#content').html()),
            "error": _.template($('#error').html())
        },
    
        events: {
            "click input:button": "check" // Обработчик клика на кнопке "Проверить"
        },
    
        initialize: function () { // Подписка на событие модели
            this.model.bind('change', this.render, this);
        },
    
        check: function () {
            var username = this.el.find(".js-username").val();
            var password = this.el.find(".js-password").val();
    
            var serverMock = {
                // передаем колбеки аргументами
                authorize: function (sendObject, success, error) {
                    // здесь должен быть ajax-запрос на проверку имени-пароля
                    if(Admins.checkUser(sendObject.username, sendObject.password)) {
                        // ответ на проверку логина должен приходить авторизационный токен
                        // асинхронность эмулируется запросами к access.txt и error.txt
                        // вызываем колбеки, они будут вызваны, когда jquery
                        $.getJSON("access.txt", success);
                    }
                    else {
                        $.getJSON("error.txt", error);
                    }
                }
            };
    
            serverMock.authorize({
                'username':username,
                'password':password
            }, function (json) { // success-ответ на авторизацию
                if (json && json.status === true && // соглашение с сервером, status = true
                    json.data && json.data.token) {
                    setCookie("token", json.data.token, "Session", "/");
                    appState.set({ // Сохранение имени пользователя и состояния
                        "state": "success", "username": username
                    });
                }
                else {
                    console.log("Authorization token problem.");
                    appState.set({ "state": "error", "username": username });
                }
            }, function (json) { // error-ответ на авторизацию
                if (json && json.status === false && // соглашение с сервером, status = false
                    json.error && json.error.messages && json.error.messages.length) {
                    console.log(json.error.messages[0]); // нужна локализация?
                }
                else {
                    console.log("Can't authorize. Unknown error...");
                }
                appState.set({ "state": "error", "username": username });
            });
    
        },
    
        render: function () {
            var state = this.model.get("state");
            $(this.el).html(this.templates[state](this.model.toJSON()));
            return this;
        }
    });
    var Header = Backbone.View.extend({
        el: $(".page-header"), // DOM элемент header
    
        template: _.template($('#header').html()),
    
        initialize: function() {
            this.render();
        },
    
        render: function() {
            this.el.html( this.template() );
        }
    });
    var Footer = Backbone.View.extend({
        el: $(".page-footer"), // DOM элемент header
    
        template: _.template($('#footer').html()),
    
        initialize: function() {
            this.render();
        },
    
        render: function() {
            this.el.html( this.template() );
        }
    });





    var header = new Header(); // создадим заголовок страницы
    var block = new Block({ model: appState }); // создадим объект блока авторизации
    var footer = new Footer(); // создадим футер страницы

    appState.trigger("change"); // Вызовем событие change у модели

    appState.bind("change:state", function () { // подписка на смену состояния для контроллера
        var state = this.get("state");
        if (state == "start")
            controller.navigate("!/", false); // false потому, что нам не надо
                                              // вызывать обработчик у Router
        else {
            if (state == "success") {
                controller.navigate("!/" + 'content', false);
            }
            else {
                controller.navigate("!/" + state, false);
            }
        }
    });

    Backbone.history.start();  // Запускаем HTML5 History push


});