window.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist()) {
    showBookData(getDataFromStorage());
  }

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const insertData = {
      id: +new Date(),
      title: elements.title.value,
      author: elements.author.value,
      year: elements.year.value,
      isCompleted: elements.completed.checked
    };

    addBook(insertData);
    clearInput();
  });


  elements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const titleSearch = document.getElementById('title-search').value;
    searchBook(titleSearch);
  });
});
