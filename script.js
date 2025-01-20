const HEADER = document.querySelector("header");
const BODY = document.querySelector("body");
let RES = "";
let DATA_ARRAY = [];

// работа с сессионной базой
class DATABASE_FOR_THIS_SESSION {
  constructor() {
    this.data = DATA_ARRAY;
  }

  addData() {
    this.username = document.querySelector("#logInput").value;
    this.site = document.querySelector("#domainInput").value;
    this.pass = RES;
    this.data.push({
      username: this.username,
      site: this.site,
      pass: this.pass,
    });
    RES = "";
  }

  getData() {
    return this.data;
  }
}

// проверка юзер-агента пользователя
const checkUA = function () {
  const who = navigator.userAgent;
  const args = /Android|iPhone|Phone|iPad|KFAPWI/;
  return (fin = who.match(args));
};
if (checkUA()) {
  const e = document.querySelector('#range');
  e.setAttribute('style', 'display: visible')
}

// обработка ползунка
const rngMv = function() {
  const e = document.querySelector('#range');
  e.addEventListener('change', () => {
    const a = document.querySelector('#lengthPass');
    a.innerHTML = e.value;
  })
}();

/* взаимодействие пользователя с UI */
// установка длины пароля
const selectLen = document.querySelector("#lengthPass");
selectLen.addEventListener("wheel", function (event) {
  event.preventDefault();
  const delta = event.deltaY;
  let len = Number(selectLen.innerHTML);
  workWithLen(delta, len);
});

// реакция на нажатие кнопки
const btn = document.querySelector("#doSmth");
btn.addEventListener("click", function () {
  passGen(Number(selectLen.innerHTML));
  new DATABASE_FOR_THIS_SESSION().addData();
  notificationAdd(
    "Уведомление",
    `Пароль был сгенерирован, данные сохранены в базу. Для просмотра сохраненных паролей нажмите кнопку "Сохраненные пароли". <b>Нажатие на уведомление скопирует пароль.</b>`,
    "PasswordCreate"
  );
});

// работа с длиной пароля
function workWithLen(delta, len) {
  if (delta < 0) {
    if (len > 60) len = 59;
    len += 1;
    selectLen.innerHTML = len;
  } else if (delta > 0) {
    if (len < 1) len = 1;
    len -= 1;
    selectLen.innerHTML = len;
  }
}

// генерация пароля
function passGen(len) {
  if (len == undefined || len <= 0) {
    len = 1;
  }
  let a =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*.,/;№%'|:?*";
  for (let i = 0; i < len; i++) {
    const math = Math.round(Math.random() * (a.length - 1));
    RES += a[math];
  }
  return RES;
}

// работа с сохраненными паролями
const passArr = document.querySelector("#dbBtn");
passArr.addEventListener("click", function () {
  const savedPass = new DATABASE_FOR_THIS_SESSION().getData();
  const Div = document.createElement("div");
  Div.innerHTML =
    "<div id='resultWindow'> <h1>Результаты за эту сессию:</h1></div>";
  if (savedPass[0]) {
    // вывод данных
    for (let i = 0; i < savedPass.length; i++) {
      Div.innerHTML += `<div> <h1>Домен: ${savedPass[i].site} </h1> <p>Логин: ${savedPass[i].username} </p> <p>Пароль: ${savedPass[i].pass} </p> </div>`;
    }
    Div.innerHTML +=
      '<div id="buttonS"><button class="closeBtn"><b>Закрыть</b></button> <button id="downloadBtn"><b>Скачать</b></button></div>';

    // функции кнопок
    setTimeout(() => {
      // закрытие окна
      document
        .querySelector(".closeBtn")
        .addEventListener("click", function () {
          Div.remove();
        });

      // создание blob из json парсера и объявление ссылки
      const file = new Blob([JSON.stringify(savedPass)], {
        type: "application/json",
      });
      const filesURL = URL.createObjectURL(file);
      const b = document.querySelector("#downloadBtn");

      // скачивание файла
      b.addEventListener("click", function (ev) {
        const a = document.createElement("a");
        a.href = filesURL;
        a.download = "database.json";
        BODY.appendChild(a);
        a.click();
        BODY.removeChild(a);
        URL.revokeObjectURL(filesURL);
      });
    }, 1);
  } else {
    Div.innerHTML += `<div> <h1>Пусто!</h1> </div>`;
    Div.innerHTML += '<button class="closeBtn"><b>Закрыть</b></button>';
    setTimeout(() => {
      document
        .querySelector(".closeBtn")
        .addEventListener("click", function () {
          Div.remove();
        });
    }, 1);
  }

  Div.setAttribute("class", "Result");
  Div.classList.add("animationNotif");
  document.body.insertBefore(Div, document.querySelector(".window-container"));
});

/* UI */
// уведомление
function notificationAdd(header, message, type) {
  // создание уведомления
  const Div = document.createElement("div");
  Div.innerHTML = `<div> <h1>${header}</h1> <p>${message}</p> </div>`;
  Div.setAttribute("class", "unselectable Notification");
  Div.classList.add("animationNotif");

  // работа с текстом уведомления
  const notifHead = Div.querySelector("h1");
  const notifText = Div.querySelector("p");
  notifHead.classList.add("textNotifAdd");
  notifText.classList.add("textNotifAdd");

  // выбор типа
  switch (type) {
    case "Error":
      Div.style.backgroundColor = "rgb(255, 85, 85)";
      break;
    case "Warning":
      Div.style.backgroundColor = "rgb(195, 209, 0)";
      break;
    case "PasswordCreate":
      Div.style.backgroundColor = "gray";
      // копирование пароля
      Div.addEventListener("click", function () {
        const passCopy = new DATABASE_FOR_THIS_SESSION().getData();
        const passFind = passCopy[passCopy.length - 1].pass;
        navigator.clipboard.writeText(passFind);
        Div.setAttribute("class", "unselectable Notification passCreate");
        setTimeout(() => {
          Div.style.backgroundColor = "rgb(0, 189, 0)";
        }, 1000);
        notifHead.innerHTML = "Скопировано!";
      });
      break;
    case "Base":
      Div.style.backgroundColor = "gray";
      break;
  }

  // добавление и удаление
  HEADER.appendChild(Div);

  setTimeout(() => {
    notifHead.classList.add("deleteTextNotif");
    notifText.classList.add("deleteTextNotif");
    Div.classList.remove("animationNotif");
    Div.classList.add("deleteNotif");

    setTimeout(() => {
      Div.remove();
      RES = "";
    }, 990);
  }, 5000);
}
