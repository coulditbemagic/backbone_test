$(function () {

  //= partials/helpers.js
  //= partials/model/objects.js
  //= partials/view/content.js
  //= partials/view/header.js
  //= partials/view/footer.js
  //= partials/router/router.js

  // Смена состояния должна приводить к изменению роута
  appState.bind('change:state', function () {
    var state = this.get('state');
    if (state == 'success') {
      router.navigate('content', true);
    }
    else if (state == 'error') {
      router.navigate('error', true);
    }
    else {
      router.navigate('', true);
    }
  });

  function runApp (isAuthorized) {
    appState.set({ 'isAuthorized': isAuthorized });
    Backbone.history.start({pushState: true, root: '/' });  // Запуск HTML5 History push
  }

  // Пробуем авторизоваться по куки
  serverMock.verifyToken(getCookie('token'), function () {
    runApp(true);
  }, function () {
    runApp(false);
  });

});
