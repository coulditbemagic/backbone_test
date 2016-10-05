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