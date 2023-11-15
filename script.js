let books = [];
const inputBook = document.getElementById('inputBook');
const bookSubmit = document.getElementById('bookSubmit');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');

document.addEventListener('DOMContentLoaded', function () {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }

    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    inputBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = Number(document.getElementById('inputBookYear').value);
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

        const isDuplicate = books.some(book => book.title === inputBookTitle);

        if (isDuplicate) {
            alert('Buku dengan judul tersebut telah terdaftar, silahkan daftarkan buku lain !');
        } else {
            const book = {
                id: new Date().getTime(),
                title: inputBookTitle,
                author: inputBookAuthor,
                year: inputBookYear,
                isComplete: inputBookIsComplete,
            };

            books.push(book);
            saveBooksToLocalStorage();
            updateBookshelf();

            document.getElementById('inputBookTitle').value = '';
            document.getElementById('inputBookAuthor').value = '';
            document.getElementById('inputBookYear').value = '';
            document.getElementById('inputBookIsComplete').checked = false;
        }
    });

    function updateBookshelf() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of books) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    function deleteBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    function toggleIsComplete(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    const searchBook = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchBookTitle.value.toLowerCase().trim();

        // mencari berdasarkan judul, penulis, dan tahun
        const searchResults = books.filter(book => {
            return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.year.toString().includes(query)
            );
        });

        updateSearchResults(searchResults);
    });

    function updateSearchResults(results) {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of results) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.className = 'book_item';
        bookItem.style.margin = '0.5rem';
        bookItem.style.backgroundImage = 'linear-gradient(90deg, #000328, #00458e';
        
        const title = document.createElement('h3');
        title.textContent = book.title;
        title.style.color = 'white';
        title.style.marginBottom = '10px';
        
        const author = document.createElement('p');
        author.textContent = '✍️ Penulis: ' + book.author;
        
        const year = document.createElement('p');
        year.textContent = '📅 Tahun: ' + book.year;

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action';
        
        const deleteButton = createActionButton('🗑️ Hapus buku', 'red', function () {
            const modal = document.getElementById('customModal');
            const yesButton = document.getElementById('yesDeleteButton');
            const noButton = document.getElementById('noDeleteButton');

            modal.style.display = 'block';

            yesButton.addEventListener("click", function() {
                deleteBook(book.id);
                modal.style.display = "none";
                showMessage("🗿Buku berhasil terhapus");
            });
            noButton.addEventListener("click", function () {
                modal.style.display = "none";
            });

            const popupMessage = document.getElementById("popupMessage");
            function showMessage(message) {
                popupMessage.innerText = message;
                popupMessage.style.display = "block";
                
                setTimeout(function () {
                    popupMessage.style.display = "none";
                }, 3000);
            }
        });

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createActionButton('⚠️ Belum selesai di Baca', 'yellow', function () {
                toggleIsComplete(book.id);
            });
        } else {
            toggleButton = createActionButton('✅ Selesai dibaca', 'green', function () {
                toggleIsComplete(book.id);
            });
        }

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(deleteButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    function createActionButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    updateBookshelf();
});