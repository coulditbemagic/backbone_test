$(function () {

  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
  
  function setCookie (name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
    ((expires) ? "; expires=" + expires : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
  }
  
  function deleteCookie (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  
  var serverMock = {
  
    verifyToken: function (token, success, fail) {
      // здесь должен быть ajax-запрос на проверку валидности авторизационного токена
      // пока же просто проверяем, что токен непустой
      if(token) {
        success();
      }
      else {
        fail();
      }
    },
  
    // передаем колбеки аргументами
    authorize: function (sendObject, success, error) {
      // здесь должен быть ajax-запрос на проверку имени-пароля
      if(Admins.checkUser(sendObject.username, sendObject.password)) {
        // ответ на проверку логина должен приходить авторизационный токен
        // асинхронность эмулируется запросами к access.txt и error.txt
        // вызываем колбеки, они будут вызваны, когда $.getJSON прочитает файл
        $.getJSON("server/access.txt", success);
      }
      else {
        $.getJSON("server/error.txt", error);
      }
    }
  };

  var AppState = Backbone.Model.extend({
      defaults: {
          isAuthorized: null,
          username: null,
          state: null
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
  var Router = Backbone.Router.extend({
      routes: {
          "": "start", // Пустой hash-тэг
          "!/": "start", // Начальная страница, форма логина
          "!/success": "success", // Защещенный авторизацией контент
          "!/error": "error" // Блок ошибки авторизации
      },
  
      start: function () {
          appState.set({ state: "start" });
      },
  
      success: function () {
          appState.set({ state: "success" });
      },
  
      error: function () {
          appState.set({ state: "error" });
      }
  });
  
  var router = new Router();
  
  Backbone.history.start();  // Запускаем HTML5 History push

  var Block = Backbone.View.extend({
    el: $('#block'), // DOM элемент login-content-error
  
    templates: { // Шаблоны на разное состояние
      'start': _.template($('#login').html()),
      'success': _.template($('#content').html()),
      'error': _.template($('#error').html())
    },
  
    events: {
      'click #btn-login': 'login', // Обработчик клика на кнопке 'Войти'
      'click #btn-logout': 'logout' // Обработчик клика на кнопке 'Выйти'
    },
  
    initialize: function () { // Подписка на изменения модели
      this.model.bind('change:isAuthorized', this.render, this);
      this.model.bind('change:state', this.render, this);
    },
  
    logout: function () {
      deleteCookie('token');
      appState.set({ 'state': 'start', 'username': null, 'isAuthorized': false });
    },
  
    login: function () {
      var username = this.el.find('.js-username').val();
      var password = this.el.find('.js-password').val();
  
      serverMock.authorize({
        'username':username,
        'password':password
      }, function (json) { // success-ответ на авторизацию
        if (json && json.status === true && // соглашение с сервером, status = true
          json.data && json.data.token) {
          setCookie('token', json.data.token, 'Session', '/');
          appState.set({ // Сохранение имени пользователя и состояния
            'isAuthorized': true, 'state': 'success', 'username': username
          });
        }
        else {
          console.log('Authorization token problem.');
          appState.set({ 'state': 'error', 'username': username });
        }
      }, function (json) { // error-ответ на авторизацию
        if (json && json.status === false && // соглашение с сервером, status = false
          json.error && json.error.messages && json.error.messages.length) {
          console.log(json.error.messages[0]); // нужна локализация?
        }
        else {
          console.log('Can\'t authorize. Unknown error...');
        }
        appState.set({ 'state': 'error', 'username': username });
      });
  
    },
  
    render: function (model) {
      var state = model.get('state');
      // проверка на защищенное авторизацией состояние
      if (state == 'success' && !model.get('isAuthorized')) {
        appState.set({ 'state': 'start' }); // сбрасываем состояние при несанкционированном доступе
        return this; // мы все равно вернемся в render(), поскольку сработает binding строкой выше
      }
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

  // Пробуем авторизоваться по куки
  var token = getCookie("token");
  serverMock.verifyToken(token, function () {
    appState.set({ "isAuthorized": true, "state": "success" });
  }, function () {
    appState.set({ "isAuthorized": false });
  })

  appState.bind("change:state", function () { // подписка на смену состояния для контроллера
    var state = this.get("state");
    if (state == "start") {
      router.navigate("!/", false);
    }
    else {
      router.navigate("!/" + state, false);
    }
  });

});