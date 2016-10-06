$(function () {

    //= partials/helpers.js

    //= partials/model/objects.js
    //= partials/router/router.js

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
            router.navigate("!/", false);
        }
        else {
            router.navigate("!/" + state, false);
        }
    });

    Backbone.history.start();  // Запускаем HTML5 History push

});
