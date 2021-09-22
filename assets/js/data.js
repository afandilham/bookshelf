const BOOKSHELF_KEY = "BOOKSHELF_APPS";

let bookData = getDataFromStorage();

function isStorageExist() {
  if (typeof(Storage) === undefined) {
    alert("There is no storage feature in your browser");
    return false;
  }
  return true;
}

function getDataFromStorage() {
  if (isStorageExist()) {
    return JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
  }
  return false;
}

function findBookById(bookData, id) {
  return bookData.filter(book => {
    const result = book.id == id;
    return result;
  });
}