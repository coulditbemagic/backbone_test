var Router = Backbone.Router.extend({
  routes: {
    '': 'start', // Начальная страница, форма логина
    'content': 'success', // Защищенный авторизацией контент
    'error': 'error', // Блок ошибки авторизации
    '*path' : 'redirect' // Все остальные пути будут вести на 'start'
  },

  redirect: function () {
    router.navigate('', {trigger: true, replace: true});
  },

  start: function () {
    if(appState.get('isAuthorized')) {
      appState.set('state', 'success');
      return;
    }
    content.render('start');
  },

  success: function () {
    if(!appState.get('isAuthorized')) {
      appState.set('state', 'start');
      return;
    }
    content.render('success')
  },

  error: function () {
    content.render('error');
  }
});

var router = new Router();
