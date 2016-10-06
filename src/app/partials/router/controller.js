var Controller = Backbone.Router.extend({
    routes: {
        "": "start", // Пустой hash-тэг
        "!/": "start", // Начальная страница
        "!/content": "content", // Блок удачи
        "!/error": "error" // Блок ошибки
    },

    start: function () {
        appState.set({ state: "start" });
    },

    content: function () {
        appState.set({ state: "success" });
    },

    error: function () {
        appState.set({ state: "error" });
    }
});

var controller = new Controller(); // Создаём контроллер