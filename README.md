# backbone login form

## Задание

**Задание**: реализовать страницу авторизации пользователей используя шаблонизатор **underscore.js**

Во вложении два файла – **error**, **access**.

Пользователь: **test@test.ru pass** – получит сообщение об ошибке.

Пользователь: **admin@admin.ru pass2** – успешно авторизуется, токен запишется в куки, откроется страница – content.

Для вёрстки **bootsrap3**.

Необходимые шаблоны: **footer**, **header**, **logIn**, **content**.

## Установка и запуск

Ставим gulp
npm install -g gulp

Ставим npm зависимости
npm install

Собираем проект
gulp build

Запускаем в браузере
./build/index.html
