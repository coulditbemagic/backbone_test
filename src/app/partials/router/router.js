// Пробуем авторизоваться по куки
function isToken() {

    var token = getCookie("token");
    var login = false;

    serverMock.verifyToken(token, function () {
        // appState.set({ "isAuthorized": true, "state": "success" });
        login = true
    }, function () {
        // appState.set({ "isAuthorized": false, 'state': 'start' });
        login = false
    });

    return login
}

var Router = Backbone.Router.extend({
    routes: {
        "": "start", // Начальная страница, форма логина
        "content": "start", // Защищенный авторизацией контент
        "content/": "success", // Защищенный авторизацией контент
        "error": "error" // Блок ошибки авторизации
    },

    start: function () {
        var content = new Content({ model: appState });
        if(isToken()) {
            content.renderSuccess()
        } else {
            content.renderStart()
        }
    },

    success: function () {
        var content = new Content({ model: appState });
        if(isToken()) {
            content.renderSuccess()
        } else {
            content.renderStart();
            router.navigate("", false);
        }
    },

    error: function () {
        var block = new Error({ model: appState });
    }
});

var router = new Router();

Backbone.history.start({pushState: true, root: '/' });  // Запускаем HTML5 History push
