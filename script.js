const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupAdd = popupBlock.querySelector(".popup-add");
const popupUpd = popupBlock.querySelector(".popup-upd");

const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const InfoForm = document.forms.InfoForm;
const cards = document.getElementsByClassName("card");

document.getElementById("user").addEventListener("click", function () {
  localStorage.removeItem("catUser");
});

let user = localStorage.getItem("catUser");
if (!user) {
  user = prompt("Представьтесь, пожалуйста");
  localStorage.setItem("catUser", user);
}

const popupInfo = document.querySelector(".popup-info");
popupInfo.querySelector(".info-close").addEventListener("click", function () {
  popupBlock.classList.remove("active");
});
//console.log(popupInfo);

document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  popupBlock.classList.add("active");
});

popupBlock.querySelectorAll(".popup__close").forEach(function (btn) {
  btn.addEventListener("click", function () {
    popupBlock.classList.remove("active");
    btn.parentElement.classList.remove("active");
    if (btn.parentElement.classList.contains("popup-upd")) {
      updForm.dataset.id = ""; // updForm.setAttribute("data-id", "")
    }
  });
});
// .addEventListener("click", function () {
//   popupBlock.classList.remove("active");
// });

document.querySelector("#add").addEventListener("click", function (e) {
  e.preventDefault();
  popupBlock.classList.add("active");
  popupAdd.classList.add("active");
});

const createCard = function (cat, parent) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = cat.id; // <div class="card" data-id="2">....</div>

  const img = document.createElement("div");
  img.className = "card-pic";
  if (cat.img_link) {
    img.style.backgroundImage = `url(${cat.img_link})`;
  } else {
    img.style.backgroundImage = "url(img/cat.png)";
    img.style.backgroundSize = "contain";
    img.style.backgroundColor = "transparent";
  }

  const name = document.createElement("h3");
  name.innerText = cat.name;

  // let like = "";
  // like.onclick = () => {
  //   //....
  //   // cat.id
  // };

  const del = document.createElement("button");
  del.innerText = "delete";
  del.classList.add("deletetCat");
  del.id = cat.id;
  del.addEventListener("click", function (e) {
    let id = e.target.id;
    deleteCat(id, card);

    let catCard = document.querySelectorAll(".card");
    for (let i = 0; i < catCard.length; i++) {
      catCard[i].addEventListener("click", function () {
        const PoBlock = document.querySelector(".popup-info");
        PoBlock.classList.add("active");
      });
    }
  });

  const upd = document.createElement("button");
  upd.innerText = "update";
  upd.classList.add("editCat");
  //upd.name = cat.name;
  upd.addEventListener("click", function (e) {
    popupUpd.classList.add("active");
    popupBlock.classList.add("active");
    showForm(cat);
    updForm.setAttribute("data-id", cat.id);
  });

  card.append(img, name, del, upd);
  parent.append(card);
};

const showForm = function (data) {
  console.log(data);
  for (let i = 0; i < updForm.elements.lenght; i++) {
    let el = updForm.elements[i];
    if (el.name) {
      if (el.type !== "checkbox") {
        el.value = data[el.name] ? data[el.name] : "";
      } else {
        el.checked = data[el.name];
      }
    }
  }
};

// createCard({ name: "Вас", img_link: "" }, container);
// createCard(
//   {
//     name: "Вася",
//     img_link:
//       "https://www.friendforpet.ru/api/sites/default/files/2022-01/%D0%BB%D0%B5%D0%B2%D0%B83_%D0%B0%D0%BB%D0%B5%D0%BA%D1%81.jpg",
//   },
//   container
// );

// запрос на сервер
fetch(`https://sb-cats.herokuapp.com/api/2/Peacemaker84/show`)
  // ответ от сервера что такой запрос существует
  .then((res) => res.json())
  // получение результата
  .then((result) => {
    // console.log(result);
    if (result.message === "ok") {
      console.log(result.data);
      result.data.forEach(function (el) {
        createCard(el, container);
      });
    }
  });

// const cat = {
// 	id: 6,
// 	name: "Василий",
// 	img_link: "https://documents.infourok.ru/b15649ae-78ff-40d2-810f-49e07e465ac8/0/image001.png"
// }

// JSON.stringify(obj) - сделает из объекта строку
// JSON.parse(str) - сделает из строки объект (если внутри строки объек)

const addCat = function (cat) {
  fetch(`https://sb-cats.herokuapp.com/api/2/Peacemaker84/add`, {
    method: "POST",
    headers: {
      // обязательно для POST/PUT/PATCH
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cat), // обязательно для POST/PUT/PATCH
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.message === "ok") {
        createCard(cat, container);
        addForm.reset();
        popupBlock.classList.remove("active");
      }
    });
};
