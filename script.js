let bookShelf = [];
const RENDER_EVENT = "render-shelf";
const SAVED_EVENT = "saved-shelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateBookShelfObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function findBook(bookId) {
  for (const book of bookShelf) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookShelf) {
    if (bookShelf[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function clearInputForm() {
  document.getElementById("book-search").reset();
}

function checkInputForm() {
  const valueForm = document.getElementById("searchTitleBook").value;

  if (valueForm !== null) {
    const buttonReset = document.querySelector(".searchReset");
    buttonReset.removeAttribute("hidden");
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializaedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializaedData);
  if (data !== null) {
    bookShelf = data;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookShelf(bookShelfObject, nomor) {
  const { id, title, author, year, isComplete } = bookShelfObject;

  let undoButton;
  let logoUndoButton;
  let trashButton;
  let logoTrashButton;
  let editButton;
  let logoEditButton;
  let checkButton;
  let logoCheckButton;

  if (isComplete) {
    undoButton = document.createElement("button");
    logoUndoButton = document.createElement("img");
    logoUndoButton.setAttribute("src", "./assets/undo_white_18dp.svg");
    undoButton.appendChild(logoUndoButton);
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBook(id);
    });

    trashButton = document.createElement("button");
    logoTrashButton = document.createElement("img");
    logoTrashButton.setAttribute("src", "./assets/delete_white_18dp.svg");
    logoTrashButton.style.color = "white";
    trashButton.appendChild(logoTrashButton);
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You will delete this book!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          removeBook(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    });

    editButton = document.createElement("button");
    logoEditButton = document.createElement("img");
    logoEditButton.setAttribute("src", "./assets/edit_white_18dp.svg");
    editButton.appendChild(logoEditButton);
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function () {
      editBook(id);
    });
  } else {
    checkButton = document.createElement("button");
    logoCheckButton = document.createElement("img");
    logoCheckButton.setAttribute("src", "./assets/check_white_18dp.svg");
    checkButton.appendChild(logoCheckButton);
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });

    trashButton = document.createElement("button");
    logoTrashButton = document.createElement("img");
    logoTrashButton.setAttribute("src", "./assets/delete_white_18dp.svg");
    trashButton.appendChild(logoTrashButton);
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You will delete this book!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          removeBook(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    });

    editButton = document.createElement("button");
    logoEditButton = document.createElement("img");
    logoEditButton.setAttribute("src", "./assets/edit_white_18dp.svg");
    editButton.appendChild(logoEditButton);
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", function () {
      editBook(id);
    });
  }

  const bookNo = document.createElement("td");
  bookNo.innerText = nomor;

  const bookTitle = document.createElement("td");
  bookTitle.innerText = `${title}`;

  const bookAuthor = document.createElement("td");
  bookAuthor.innerText = `${author}`;

  const bookYear = document.createElement("td");
  bookYear.innerText = `${year}`;

  const bookOption = document.createElement("td");
  bookOption.append(undoButton ?? checkButton, trashButton, editButton);

  const trBody = document.createElement("tr");
  trBody.append(bookNo, bookTitle, bookAuthor, bookYear, bookOption);

  const tbody = document.createElement("tbody");
  tbody.appendChild(trBody);

  return trBody;
}

function submitBookShelf() {
  const generatedID = generateId();
  const bookTitle = document.getElementById("bookTitle");
  const bookAuthor = document.getElementById("bookAuthor");
  const bookYear = document.getElementById("bookYear");
  const inputBookDone = document.getElementById("inputBookDone");

  const IdBook = document.getElementById("IdBook");
  console.log("value", IdBook.value);
  if (IdBook.value === "") {
    // addbook
    const bookShelfObject = generateBookShelfObject(generatedID, bookTitle.value, bookAuthor.value, bookYear.value, inputBookDone.checked);
    bookShelf.push(bookShelfObject);
  } else {
    // editbook
    const index = findBookIndex(IdBook.value);
    bookShelf[index].isComplete = inputBookDone.checked;
    console.log(IdBook.value, index);
    bookShelf[index].title = bookTitle.value;
    bookShelf[index].author = bookAuthor.value;
    bookShelf[index].year = bookYear.value;
  }

  IdBook.value = "";
  bookTitle.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  inputBookDone.checked = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  console.log(bookId);
  if (bookTarget === -1) return;
  bookShelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  console.log(bookId);
  if (bookTarget == null) return;
  const IdBook = document.getElementById("IdBook");
  IdBook.value = bookTarget.id;
  const bookTitle = document.getElementById("bookTitle");
  bookTitle.value = bookTarget.title;
  const bookAuthor = document.getElementById("bookAuthor");
  bookAuthor.value = bookTarget.author;
  const bookYear = document.getElementById("bookYear");
  bookYear.value = bookTarget.year;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBookShelf();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const bookSearch = document.getElementById("book-search");
  bookSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitleBook = document.getElementById("searchTitleBook").value;
    const searchBook = [];
    for (const book of bookShelf) {
      if (book.title.toLowerCase().includes(searchTitleBook.toLowerCase())) {
        searchBook.push(book);
      }
    }
    renderSearch(searchBook);
    checkInputForm();
  });
});

function renderSearch(books) {
  const uncompletedBookList = document.getElementById("uncompletedBookList");
  const completedBookList = document.getElementById("completedBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  let bookComplete = 1;
  let bookUncomplete = 1;

  for (const bookItem of books) {
    if (bookItem.isComplete) {
      const bookElement = makeBookShelf(bookItem, bookComplete);
      completedBookList.append(bookElement);
      bookComplete += 1;
    } else {
      const bookElement = makeBookShelf(bookItem, bookUncomplete);
      uncompletedBookList.append(bookElement);
      bookUncomplete += 1;
    }
  }
}

document.addEventListener(SAVED_EVENT, () => console.log(localStorage.getItem(STORAGE_KEY)));
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("uncompletedBookList");
  const completedBookList = document.getElementById("completedBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  let bookComplete = 1;
  let bookUncomplete = 1;

  for (const bookItem of bookShelf) {
    if (bookItem.isComplete) {
      const bookElement = makeBookShelf(bookItem, bookComplete);
      completedBookList.append(bookElement);
      bookComplete += 1;
    } else {
      const bookElement = makeBookShelf(bookItem, bookUncomplete);
      uncompletedBookList.append(bookElement);
      bookUncomplete += 1;
    }
  }
});
