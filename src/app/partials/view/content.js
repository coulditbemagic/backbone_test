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
