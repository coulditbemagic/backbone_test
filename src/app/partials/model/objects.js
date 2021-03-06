var AppState = Backbone.Model.extend({ // модель состояния приложения
  validate: function(attrs){
    if ((attrs.username).indexOf('@') < 0) {
      console.log('INVALID_LOGIN');
      return this
    }
  },
  defaults: {
    isAuthorized: null,
    username: null,
    state: null
  }
});

var appState = new AppState();

var UserNameModel = Backbone.Model.extend({ // Модель пользователя
  defaults: {
    'Name': '',
    'Password': ''
  }
});

var AdminsCollection = Backbone.Collection.extend({ // Коллекция пользователей

  model: UserNameModel,

  checkUser: function (username, password) { // Проверка пользователя
    var findResult = this.find(function (user) { return (user.get('Name') == username && user.get('Password') == password) });
    return findResult != null;
  }

});

var Admins = new AdminsCollection([ // Админы, которым показываем контент
  { Name: 'admin@admin.ru', Password: 'pass2' },
  { Name: '@', Password: '' }
]);
