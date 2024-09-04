let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("product-select");
let submit = document.getElementById("submit");

let mood = "create";
let temp;

window.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (document.activeElement === title) {
      price.focus();
    } else if (document.activeElement === price) {
      taxes.focus();
    } else if (document.activeElement === taxes) {
      ads.focus();
    } else if (document.activeElement === ads) {
      discount.focus();
    } else if (document.activeElement === discount) {
      count.focus();
    } else if (document.activeElement === count) {
      category.focus();
    } else if (document.activeElement === category) {
      submit.focus();
    }
  }
});

// get total
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "green";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "red";
  }
}
let savedata;
if (localStorage.product != null) {
  savedata = JSON.parse(localStorage.product);
} else {
  savedata = [];
}
// creat product
submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };
  if (
    title.value != "" &&
    price.value != "" &&
    category.value != "" &&
    newPro.count < 100
  ) {
    if (mood === "create") {
      // count
      if (newPro.count > 1) {
        savedata.push(newPro);
      }
    } else {
      savedata[temp] = newPro;
      mood = "create";
      submit.innerHTML = "Create";
    }
    clearData();
  }
  if (title.value === "") {
    title.focus();
  } else if (price.value === "") {
    price.focus();
  } else if (category.value === "") {
    category.focus();
  } else if (newPro.count >= 100) {
    count.focus();
  }
  // save localstorage
  localStorage.setItem("product", JSON.stringify(savedata));

  ShowData();
};

// clean inputs
function clearData() {
  price.value = "";
  title.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}
// read
function ShowData() {
  getTotal();
  let tabel = "";
  for (let i = 0; i < savedata.length; i++) {
    tabel += `
    <tr id="tr-${i}">
    <td>${i + 1}</td>
    <td>${savedata[i].title}</td>
    <td>${savedata[i].price}</td>
    <td>${savedata[i].taxes}</td>
    <td>${savedata[i].ads}</td>
    <td>${savedata[i].discount}</td>
    <td>${savedata[i].category}</td>
    <td style="color: chartreuse;font-size: 23px;">${savedata[i].count}</td>
    <td>${savedata[i].total}</td>
    <td><button class="update-btn" onclick="UpdateData(${i})" id="update">update</button></td>
    <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">delete</button></td>
    </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = tabel;
  let btndeleteall = document.getElementById("deleteall");
  if (savedata.length > 0) {
    btndeleteall.innerHTML = `<button class="delete_all" onclick="deleteAll()" >Delete All (${savedata.length})</button>`;
  } else {
    btndeleteall.innerHTML = "";
  }
}
ShowData();

// update
function UpdateData(i) {
  document
    .querySelectorAll("tr")
    .forEach((row) => row.classList.remove("highlighted"));
  const selectedRow = document.getElementById(`tr-${i}`);
  selectedRow.classList.add("highlighted");

  title.value = savedata[i].title;
  price.value = savedata[i].price;
  taxes.value = savedata[i].taxes;
  ads.value = savedata[i].ads;
  discount.value = savedata[i].discount;
  count.value = savedata[i].count;
  getTotal();
  category.value =
    savedata[i].category[0].toUpperCase() + savedata[i].category.slice(1);
  submit.innerHTML = "Update";
  mood = "update";
  temp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// deleteall_item
function disableEnterKey() {
  window.addEventListener("keydown", preventEnterKey, true);
}
function enableEnterKey() {
  window.removeEventListener("keydown", preventEnterKey, true);
}

function preventEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}

function deleteAll() {
  let overlay = `<div class="overlay"></div>`;
  let alerts = `
    <div class="alert">
    <p>Do you want to delete All Products</p>
      <i class="fa-solid fa-trash"></i>
      <div class="dl-confirm">
      <button class="confirm" id="Yes">Yes</button>
      <button class="confirm" id="No">No</button>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", overlay + alerts);
  disableEnterKey();
  // اختيار العناصر بعد إضافتها
  let alert = document.querySelector(".alert");
  let yes_confirm = document.getElementById("Yes");
  let no_confirm = document.getElementById("No");

  // إعداد الأحداث للنقر على الأزرار
  yes_confirm.onclick = function () {
    alert.remove();
    document.querySelector(".overlay").remove();
    localStorage.clear();
    savedata.splice(0);
    ShowData();
    enableEnterKey();
  };
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      alert.remove();
      let overlay = document.querySelector(".overlay");
      if (overlay) {
        overlay.remove();
      }
      clearData();
      enableEnterKey();
    }
  });
  no_confirm.onclick = function () {
    alert.remove();
    document.querySelector(".overlay").remove();
    clearData();
    enableEnterKey();
  };
}
// delete
function delete_item(i) {
  let overlay = `<div class="overlay"></div>`;
  let alerts = `
  <div class="alert">
  <p>Do You Want to Delete product ${i + 1}</p>
    <i class="fa-solid fa-trash"></i>
    <div class="dl-confirm">
    <button class="confirm" id="Yes">Yes</button>
      <button class="confirm" id="No">No</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", overlay + alerts);
  disableEnterKey();
  // اختيار العناصر بعد إضافتها
  let alert = document.querySelector(".alert");
  let yes_confirm = document.getElementById("Yes");
  let no_confirm = document.getElementById("No");

  // إعداد الأحداث للنقر على الأزرار
  yes_confirm.onclick = function () {
    alert.remove();
    document.querySelector(".overlay").remove();
    savedata.splice(i, 1);
    localStorage.product = JSON.stringify(savedata);
    ShowData();
    clearData();
    enableEnterKey();
  };
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      alert.remove();
      let overlay = document.querySelector(".overlay");
      if (overlay) {
        overlay.remove();
      }
      clearData();
      enableEnterKey();
    }
  });
  no_confirm.onclick = function () {
    alert.remove();
    document.querySelector(".overlay").remove();
    clearData();
    enableEnterKey();
  };
}

// search
let SearchMood = "Title";
function getSearchMood(id) {
  let search = document.getElementById("search");
  if (id === "title_search") {
    SearchMood = "Title";
  } else {
    SearchMood = "Category";
    ShowData();
  }
  search.placeholder = "Search With " + SearchMood;
  search.focus();
  search.value = "";
  ShowData();
}
function searchData(value) {
  let tabel = "";
  for (let i = 0; i < savedata.length; i++) {
    if (SearchMood === "Title") {
      if (savedata[i].title.toLowerCase().includes(value.toLowerCase())) {
        tabel += `
        <tr id="tr-${i}">
        <td>${i + 1}</td>
        <td>${savedata[i].title}</td>
        <td>${savedata[i].price}</td>
        <td>${savedata[i].taxes}</td>
        <td>${savedata[i].ads}</td>
        <td>${savedata[i].discount}</td>
        <td>${savedata[i].category}</td>
        <td style="color: chartreuse;font-size: 23px;">${savedata[i].count}</td>
        <td>${savedata[i].total}</td>
        <td><button class="update-btn" onclick="UpdateData(${i})" id="update">update</button></td>
        <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">delete</button></td>
        </tr>
    `;
      }
    } else if (SearchMood === "Category") {
      if (savedata[i].category.includes(value)) {
        tabel += `
        <tr id="tr-${i}">
        <td>${i + 1}</td>
        <td>${savedata[i].title}</td>
        <td>${savedata[i].price}</td>
        <td>${savedata[i].taxes}</td>
        <td>${savedata[i].ads}</td>
        <td>${savedata[i].discount}</td>
        <td>${savedata[i].category}</td>
        <td style="color: chartreuse;font-size: 23px;">${savedata[i].count}</td>
        <td>${savedata[i].total}</td>
        <td><button class="update-btn" onclick="UpdateData(${i})" id="update">update</button></td>
        <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">delete</button></td>
        </tr>
        `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = tabel;
}

// ===========================================
if (location.pathname.endsWith("/arabic.html")) {
  // read
  function ShowData() {
    getTotal();
    let tabel = "";
    for (let i = 0; i < savedata.length; i++) {
      tabel += `
      <tr id="tr-${i}">
      <td>${i + 1}</td>
      <td>${savedata[i].title}</td>
      <td>${savedata[i].price}</td>
      <td>${savedata[i].taxes}</td>
      <td>${savedata[i].ads}</td>
      <td>${savedata[i].discount}</td>
      <td>${savedata[i].category}</td>
      <td style="color: chartreuse;font-size: 23px;">${savedata[i].count}</td>
      <td>${savedata[i].total}</td>
      <td><button class="update-btn" onclick="UpdateData(${i})" id="update">تحديث</button></td>
      <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">حذف</button></td>
      </tr>
    `;
    }
    document.getElementById("tbody").innerHTML = tabel;
    let btndeleteall = document.getElementById("deleteall");
    if (savedata.length > 0) {
      btndeleteall.innerHTML = `<button class="delete_all" onclick="deleteAll()" >حذف الكل (${savedata.length})</button>`;
    } else {
      btndeleteall.innerHTML = "";
    }
  }
  ShowData();

  // search
  function getSearchMood(id) {
    let search = document.getElementById("search");
    if (id === "title_search") {
      SearchMood = "Title";
      search.placeholder = "البحث باسم المنتج";
    } else {
      SearchMood = "Category";
      search.placeholder = "البحث باسم بالفئه";
    }
    search.focus();
    search.value = "";
    ShowData();
  }
  function searchData(value) {
    let tabel = "";
    for (let i = 0; i < savedata.length; i++) {
      if (SearchMood === "Title") {
        if (savedata[i].title.includes(value.toLowerCase())) {
          tabel += `
          <tr id="tr-${i}">
          <td>${i + 1}</td>
          <td>${savedata[i].title}</td>
          <td>${savedata[i].price}</td>
          <td>${savedata[i].taxes}</td>
          <td>${savedata[i].ads}</td>
          <td>${savedata[i].discount}</td>
          <td>${savedata[i].category}</td>
          <td style="color: chartreuse;font-size: 23px;">${
            savedata[i].count
          }</td>
          <td>${savedata[i].total}</td>
          <td><button class="update-btn" onclick="UpdateData(${i})" id="update">تحديث</button></td>
          <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">حذف</button></td>
          </tr>
          `;
        }
      } else {
        if (SearchMood === "Category") {
          if (savedata[i].category.includes(value)) {
            tabel += `
            <tr id="tr-${i}">
            <td>${i + 1}</td>
            <td>${savedata[i].title}</td>
            <td>${savedata[i].price}</td>
            <td>${savedata[i].taxes}</td>
            <td>${savedata[i].ads}</td>
            <td>${savedata[i].discount}</td>
            <td>${savedata[i].category}</td>
            <td style="color: chartreuse;font-size: 23px;">${
              savedata[i].count
            }</td>
            <td>${savedata[i].total}</td>
            <td><button class="update-btn" onclick="UpdateData(${i})" id="update">تحديث</button></td>
            <td><button class="delete-btn" onclick="delete_item(${i})"  id="delete">حذف</button></td>
            </tr>
            `;
          }
        }
      }
    }
    document.getElementById("tbody").innerHTML = tabel;
  }
  // delete All_Item
  function deleteAll() {
    let overlay = `<div class="overlay"></div>`;
    let alerts = `
      <div class="alert">
      <p>هل تريد حذف جميع المنتجات </p>
        <i class="fa-solid fa-trash"></i>
        <div class="dl-confirm">
        <button class="confirm" id="No">لا</button>
        <button class="confirm" id="Yes">نعم</button>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", overlay + alerts);
    disableEnterKey();
    // اختيار العناصر بعد إضافتها
    let alert = document.querySelector(".alert");
    let yes_confirm = document.getElementById("Yes");
    let no_confirm = document.getElementById("No");

    // إعداد الأحداث للنقر على الأزرار
    yes_confirm.onclick = function () {
      alert.remove();
      document.querySelector(".overlay").remove();
      localStorage.clear();
      savedata.splice(0);
      ShowData();
      enableEnterKey();
    };
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        alert.remove();
        let overlay = document.querySelector(".overlay");
        if (overlay) {
          overlay.remove();
        }
        clearData();
        enableEnterKey();
      }
    });
    no_confirm.onclick = function () {
      alert.remove();
      document.querySelector(".overlay").remove();
      clearData();
      enableEnterKey();
    };
  }
  // delete one_Item
  function delete_item(i) {
    let overlay = `<div class="overlay"></div>`;
    let alerts = `
    <div class="alert">
    <p>هل تريد حذف منتج رقم ${i + 1}</p>
      <i class="fa-solid fa-trash"></i>
      <div class="dl-confirm">
        <button class="confirm" id="No">لا</button>
        <button class="confirm" id="Yes">نعم</button>
      </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", overlay + alerts);
    disableEnterKey();
    // اختيار العناصر بعد إضافتها
    let alert = document.querySelector(".alert");
    let yes_confirm = document.getElementById("Yes");
    let no_confirm = document.getElementById("No");

    // إعداد الأحداث للنقر على الأزرار
    yes_confirm.onclick = function () {
      alert.remove();
      document.querySelector(".overlay").remove();
      savedata.splice(i, 1);
      localStorage.product = JSON.stringify(savedata);
      ShowData();
      clearData();
      enableEnterKey();
    };
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        alert.remove();
        let overlay = document.querySelector(".overlay");
        if (overlay) {
          overlay.remove();
        }
        clearData();
        enableEnterKey();
      }
    });
    no_confirm.onclick = function () {
      alert.remove();
      document.querySelector(".overlay").remove();
      clearData();
      enableEnterKey();
    };
  }
}
