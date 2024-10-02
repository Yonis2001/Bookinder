// DOM Elements
const bookList = document.getElementById("bookList");
const bookModal = document.getElementById("bookModal");
const bookDetails = document.getElementById("bookDetails");
const closeModalBtn = document.querySelector(".close-btn");
const searchBox = document.getElementById("searchBox");

// Function to fetch books from Google Books API
async function fetchBooks(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
    }
}

// Function to display books
function displayBooks(books) {
    bookList.innerHTML = "";
    books.forEach((book, index) => {
        const volumeInfo = book.volumeInfo;
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");
        bookItem.innerHTML = `
            <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x195'}" alt="${volumeInfo.title}">
            <h3>${volumeInfo.title}</h3>
            <p>by ${volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown"}</p>
        `;
        bookItem.addEventListener("click", () => showBookDetails(volumeInfo));
        bookList.appendChild(bookItem);
    });
}

// Function to show book details in modal
function showBookDetails(volumeInfo) {
    bookDetails.innerHTML = `
        <h2>${volumeInfo.title}</h2>
        <p><strong>Author:</strong> ${volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown"}</p>
        <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x195'}" alt="${volumeInfo.title}" style="width:100%; max-height: 400px; object-fit: cover;">
        <p>${volumeInfo.description ? volumeInfo.description : "No description available."}</p>
        <p><strong>Publisher:</strong> ${volumeInfo.publisher ? volumeInfo.publisher : "Unknown"}</p>
        <p><strong>Published Date:</strong> ${volumeInfo.publishedDate ? volumeInfo.publishedDate : "Unknown"}</p>
    `;
    bookModal.style.display = "block";
}

// Function to close modal
closeModalBtn.addEventListener("click", () => {
    bookModal.style.display = "none";
});

// Close modal when clicking outside the content
window.onclick = function (event) {
    if (event.target === bookModal) {
        bookModal.style.display = "none";
    }
};

// Search functionality using Google Books API
searchBox.addEventListener("input", async () => {
    const searchTerm = searchBox.value.trim();
    if (searchTerm) {
        const books = await fetchBooks(searchTerm);
        displayBooks(books);
    } else {
        bookList.innerHTML = "<p>Please enter a search term to find books.</p>";
    }
});

// Initial empty search (to prompt user to search)
bookList.innerHTML = "<p>Search for a book above to see results...</p>";
