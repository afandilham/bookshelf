function addBook(book) {
  if (!isStorageExist()) {
    bookData = JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
  } else {
    localStorage.setItem(BOOKSHELF_KEY, 0);
  }

  bookData.push(book);
  localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(bookData));

  showBookData(getDataFromStorage());
}

function clearInput() {
  elements.title.value = '';
  elements.author.value = '';
  elements.year.value = '';
  elements.completed.checked = false;
}

function addBookToCompleted(bookId) {

  const findBook = findBookById(bookData, bookId);

  const newBookData = {
    id: findBook[0].id,
    title: findBook[0].title,
    author: findBook[0].author,
    year: findBook[0].year,
    isCompleted: true,
  };

  const indexBook = bookData.findIndex(book => book.id == bookId);
  const deleteBook = bookData.splice(indexBook, 1);

  localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(deleteBook));

  addBook(newBookData);
}

function undoBookFromCompleted(bookId) {
  const findBook = findBookById(bookData, bookId);

  const newBookData = {
    id: findBook[0].id,
    title: findBook[0].title,
    author: findBook[0].author,
    year: findBook[0].year,
    isCompleted: false,
  };

  const indexBook = bookData.findIndex(book => book.id == bookId);
  const deleteBook = bookData.splice(indexBook, 1);

  localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(deleteBook));

  addBook(newBookData);
}

function removeBook(bookId) {
  popUpModal(bookId);
}

function popUpModal(bookId) {
  const getBookDetail = bookData.filter(book => book.id == bookId);

  elements.body.insertAdjacentHTML('afterend', `
    <div id="modal" class="mx-auto max-w-xl top-0 left-0 right-0 bottom-0 sticky">
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete ${getBookDetail[0].title}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete this book data? The data will be permanently removed. This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button id="${bookId}" type="button"
            class="remove-button w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Remove
          </button>
          <button type="button"
            class="cancel-button mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `);

  const removeButton = document.querySelector('.remove-button');
  const cancelButton = document.querySelector('.cancel-button');
  const modal = document.getElementById('modal');

  removeButton.addEventListener('click', () => {
    const bookList = document.getElementById(bookId);

    const remove = bookData.filter(book => book.id != bookId);
    localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(remove));

    bookList.remove();
    modal.remove();
    
    location.reload();
  });

  cancelButton.addEventListener('click', () => {
    modal.remove();
  });
}

function searchBook(bookTitle) {
  const getFilteredTitle = bookData.filter(book => book.title == bookTitle);

  elements.listUncompleted.remove();
  elements.listCompleted.remove();

  elements.uncompletedTitle.innerText = 'Uncompleted = Red';
  elements.completedTitle.innerText = 'Completed = Green';

  elements.searchResult.classList.remove('hidden');
  elements.searchResult.innerHTML = '';

  const clearElement = `
    <button id="button-refresh" onclick="location.reload()"
      class="block bg-gray-800 px-2 py-1 text-md font-medium text-center text-gray-200 mx-4 rounded transition-all hover:bg-gray-700 ring ring-gray-300 transform hover:-translate-y-0.5 my-3">
      <svg class="inline-flex w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      <span class="inline-flex text-md">CLEAR</span>
    </button>
  `;

  elements.searchResult.innerHTML += clearElement;

  getFilteredTitle.forEach(book => {
    let markup = `
      <div id="${book.id}">
        <div class="flex justify-between rounded border-l-4 border-${book.isCompleted ? 'green' : 'red'}-500 bg-gray-300 dark:bg-gray-800 mt-4"">
          <div class="p-3">
            <h1 class="text-lg font-semibold">${book.title}</h1>
            <div class="text-sm">By <span>${book.author}</span></div>
            <div>${book.year}</div>
          </div>
          <div class="flex flex-col mr-2 my-2">
            <button onclick="removeBook('${book.id}')">
              <svg
                class="w-10 h-10 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:text-gray-200 transition ease-in-out duration-300 transform hover:scale-110 hover:bg-red-600 hover:shadow-md"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    elements.searchResult.innerHTML += markup;
  });
}

function showBookData(book) {
  elements.listCompleted.innerHTML = '';
  elements.listUncompleted.innerHTML = '';

  book.forEach(book => {
    if (book.isCompleted == false) {
      let markup = `
        <div id="${book.id}">
          <div class="flex justify-between rounded border-l-4 border-red-500 bg-gray-300 dark:bg-gray-700 mt-4"">
            <div class="p-3">
              <h1 class="text-lg font-semibold">${book.title}</h1>
              <div class="text-sm">By <span>${book.author}</span></div>
              <div>${book.year}</div>
            </div>
            <div class="flex flex-col mr-2 my-2">
              <button onclick="addBookToCompleted('${book.id}')">
                <svg
                  class="w-10 h-10 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:text-gray-200 transition ease-in-out duration-300 transform hover:scale-110 hover:bg-green-600 hover:shadow-md"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              <button onclick="removeBook('${book.id}')">
                <svg
                  class="w-10 h-10 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:text-gray-200 transition ease-in-out duration-300 transform hover:scale-110 hover:bg-red-600 hover:shadow-md"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      elements.listUncompleted.innerHTML += markup;
    } else {
      let markup = `
        <div id="${book.id}">
          <div class="flex justify-between rounded border-l-4 border-green-500 bg-gray-300 dark:bg-gray-700 mt-4"">
            <div class="p-3">
              <h1 class="text-lg font-semibold">${book.title}</h1>
              <div class="text-sm">By <span>${book.author}</span></div>
              <div>${book.year}</div>
            </div>
            <div class="flex flex-col mr-2 my-2">
              <button onclick="undoBookFromCompleted('${book.id}')">
                <svg
                  class="w-10 h-10 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:text-gray-200 transition ease-in-out duration-300 transform hover:scale-110 hover:bg-blue-600 hover:shadow-md"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
              </button>
              <button onclick="removeBook('${book.id}')">
                <svg
                  class="w-10 h-10 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:text-gray-200 transition ease-in-out duration-300 transform hover:scale-110 hover:bg-red-600 hover:shadow-md"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      elements.listCompleted.innerHTML += markup;
    }
  });
}