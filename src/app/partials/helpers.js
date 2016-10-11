function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookie (name, value, expires, path, domain, secure) {
  document.cookie = name + "=" + escape(value) +
  ((expires) ? "; expires=" + expires : "") +
  ((path) ? "; path=" + path : "") +
  ((domain) ? "; domain=" + domain : "") +
  ((secure) ? "; secure" : "");
}

function deleteCookie (name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


var serverMock = {

  verifyToken: function (token, success, fail) {
    // здесь должен быть ajax-запрос на проверку валидности авторизационного токена
    // пока же просто проверяем, что токен непустой
    if(token) {
      success();
    }
    else {
      fail();
    }
  },

  // передаем колбеки аргументами
  authorize: function (sendObject, success, error) {
    // здесь должен быть ajax-запрос на проверку имени-пароля
    if(Admins.checkUser(sendObject.username, sendObject.password)) {
      // ответ на проверку логина должен приходить авторизационный токен
      // асинхронность эмулируется запросами к access.txt и error.txt
      // вызываем колбеки, они будут вызваны, когда $.getJSON прочитает файл
      $.getJSON("server/access.txt", success);
    }
    else {
      $.getJSON("server/error.txt", error);
    }
  }
};
