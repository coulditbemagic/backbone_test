$(function () {

    //= partials/helpers.js

    //= partials/model/objects.js
    //= partials/router/controller.js

    //= partials/view/content.js
    //= partials/view/header.js
    //= partials/view/footer.js

    var header = new Header(); // создадим заголовок страницы
    var block = new Block({ model: appState }); // создадим объект блока авторизации
    var footer = new Footer(); // создадим футер страницы

    appState.trigger("change"); // Вызовем событие change у модели

    appState.bind("change:state", function () { // подписка на смену состояния для контроллера
        var state = this.get("state");
        if (state == "start") {
            controller.navigate("!/", false); // false потому, что нам не надо
        }                                     // вызывать обработчик у Router
        else {
            if (state == "success") {
                controller.navigate("!/" + 'content', false);
            }
            else {
                controller.navigate("!/" + state, false);
            }
        }
    });

    Backbone.history.start();  // Запускаем HTML5 History push

});
