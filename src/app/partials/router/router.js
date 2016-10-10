var Router = Backbone.Router.extend({
    routes: {
        "": "start", // Начальная страница, форма логина
        "content": "success", // Защищенный авторизацией контент
        "content/": "success", // Защищенный авторизацией контент
        "error": "error" // Блок ошибки авторизации
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

Backbone.history.start({pushState: true, root: '/' });  // Запускаем HTML5 History push
