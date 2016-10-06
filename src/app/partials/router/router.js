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
