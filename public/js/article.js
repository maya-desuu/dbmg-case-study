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
    files.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
    return files;
  } catch (error) {
    throw new Error("Error fetching files:", error);
  }
}

function displayFiles(files) {
  const articles = files
    .map((file) => {
      const capitalizedTitle = capitalizeWords(file.metadata.title);
      return `
          <div class="article-info" onclick="window.location.href='/view-article?id=${file._id}'">
            <div class="metadata">Title: ${capitalizedTitle}</div>
            <div class="metadata">Researchers: ${file.metadata.researchers.join(", ")}</div>
            <div class="metadata">Research Adviser: ${file.metadata.researchAdviser}</div>
            <div class="metadata">Date Approved: ${file.metadata.dateApproved}</div>
          </div>
        `;
    })
    .join("");

  articleContainer.innerHTML = articles;
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

    const filteredFiles = window.allFiles.filter(
      (file) =>
        //regex.test(file.filename.toLowerCase()) ||
        regex.test(file.metadata.title.toLowerCase()),
      //regex.test(file.metadata.researchers.join(" ").toLowerCase()) ||
      //regex.test(file.metadata.researchAdviser.toLowerCase()),
    );

    // Limit search results to 10 files
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
