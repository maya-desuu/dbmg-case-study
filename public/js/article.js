const loadingIndicator = document.querySelector(".loading-indicator");
const articleContainer = document.querySelector(".article-container");
const searchInput = document.getElementById("se");

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Clear existing content in DOM
  articleContainer.innerHTML = "";
  searchInput.value = "";

  toggleVisibility(loadingIndicator, false);

  // Fetch files and set up event listeners
  fetchFiles()
    .then((files) => {
      // Store files globally to use in search functionality
      window.allFiles = files;

      // Display all files initially
      displayFiles(files);

      // Add event listener to search input
      searchInput.addEventListener("input", handleSearch);
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
    });
}

async function fetchFiles() {
  try {
    const response = await axios.get("/api/v1/files");
    const files = response.data;

    // Sort files alphabetically by filename
    files.sort((a, b) => a.filename.localeCompare(b.filename));
    return files;
  } catch (error) {
    throw new Error("Error fetching files:", error);
  }
}

function displayFiles(files) {
  articleContainer.innerHTML = ""; // Clear previous content
  files.forEach((file) => {
    // Capitalize first letter of filename
    const capitalizedFilename = capitalizeWords(file.filename);

    const fileName = document.createElement("div");
    fileName.classList.add("file-name");
    fileName.textContent = capitalizedFilename;

    const bookIcon = document.createElement("div");
    bookIcon.innerHTML = '<ion-icon name="book-outline"></ion-icon>';
    bookIcon.classList.add("book-icon");

    // Container for data infos
    const articleInfo = document.createElement("div");
    articleInfo.classList.add("article-info");
    articleInfo.appendChild(fileName);
    articleInfo.appendChild(bookIcon);

    fileName.addEventListener("click", () => {
      window.location.href = `/view-article?id=${file._id}`;
    });
    articleContainer.appendChild(articleInfo);
  });
}

function handleSearch() {
  let query = searchInput.value.trim().toLowerCase();

  // If the search input is empty, display all files
  if (query === "") {
    displayFiles(window.allFiles);
    return;
  }

  // Escape special characters in the query
  query = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const regex = new RegExp(query, "i");

    const filteredFiles = window.allFiles.filter((file) =>
      regex.test(file.filename.toLowerCase()),
    );

    // Limit search results to 6 files
    displayFiles(filteredFiles.slice(0, 10));
  } catch (error) {
    console.error("Invalid regular expression:", error);
    displayFiles([]);
  }
}

// cool toggler
function toggleVisibility(element, isVisible) {
  element.style.display = isVisible ? "block" : "none";
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
