var Block = Backbone.View.extend({
  el: $('#block'), // DOM элемент login-content-error

  templates: { // Шаблоны на разное состояние
    'start': _.template($('#login').html()),
    'success': _.template($('#content').html()),
    'error': _.template($('#error').html())
  },

  events: {
    'keydown': 'keyAction',
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
    var username = $(this.el).find('.js-username');
    var username_text = username.val();
    var password_text = $(this.el).find('.js-password').val();

    appState.set({'username': username_text});

    if (appState.isValid()) { // Валидация имени пользователя
      serverMock.authorize({
        'username': username_text,
        'password': password_text
      }, function (json) { // success-ответ на авторизацию
        if (json && json.status === true && // соглашение с сервером, status = true
            json.data && json.data.token) {
            setCookie('token', json.data.token, 'Session', '/');
            appState.set({ // Сохранение состояния
              'isAuthorized': true, 'state': 'success'
            });
        }
        else {
          console.log('TOKEN_ERROR');
          appState.set({'state': 'error'});
        }
      }, function (json) { // error-ответ на авторизацию

        if (json && json.status === false && // соглашение с сервером, status = false
            json.error && json.error.messages && json.error.messages.length) {
          console.log(json.error.messages[0]); // нужна локализация?
        }
        else {
          console.log('UNKNOWN_ERROR');
        }

        appState.set({'state': 'error'});

      });
    } else {
      username.parent().addClass('has-error').find('.js-username-error').show()
    }

  },

  render: function () {
    var state = this.model.get('state');
    // проверка на защищенное авторизацией состояние
    if (state == 'success' && !this.model.get('isAuthorized')) {
      appState.set({ 'state': 'start' }); // сбрасываем состояние при несанкционированном доступе
      router.navigate("", true);
      Backbone.history.loadUrl();
      return this; // мы все равно вернемся в render(), поскольку сработает binding строкой выше
    }
    $(this.el).html(this.templates[state](this.model.toJSON()));
    return this;
  },

  keyAction: function (e) {
    var code = e.keyCode || e.which;
    if(code == 13) {
      $('#btn-login').trigger('click')
    }
  }

});
