const loadingIndicator = document.querySelector(".loading-indicator");
const articleContainer = document.querySelector(".article-container");

document.addEventListener("DOMContentLoaded", async () => {
  // Clear existing content in dom
  articleContainer.innerHTML = "";
  se.value = "";

  try {
    const response = await axios.get("/api/v1/files");
    const files = response.data;

    // Sort files alphabetically by filename
    files.sort((a, b) => a.filename.localeCompare(b.filename));

    // hide elem once dom is loaded
    toggleVisibility(loadingIndicator, false);

    // Iterate over files and create file items dynamically
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Capitalize first letter of filename
      const capitalizedFilename = capitalizeWords(file.filename);

      const fileName = document.createElement("div");
      fileName.classList.add("file-name");
      fileName.textContent = capitalizedFilename;
      //fileName.setAttribute("data-id", file._id);

      const bookIcon = document.createElement("div");
      bookIcon.innerHTML = '<ion-icon name="book-outline"></ion-icon>';
      bookIcon.classList.add("book-icon");

      //const fileContent = document.createElement("div");
      //fileContent.classList.add("file-content");
      //fileContent.id = `content-${file.filename}`;
      //fileItem.appendChild(fileContent);

      // container for data infos
      const articleInfo = document.createElement("div");
      articleInfo.classList.add("article-info");
      articleInfo.appendChild(fileName);
      articleInfo.appendChild(bookIcon);

      fileName.addEventListener("click", () => {
        window.location.href = `/view-article?id=${file._id}`;
      });
      articleContainer.appendChild(articleInfo);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
  }
});

const se = document.querySelector("#se");

se.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const inputVal = searchInput.value.trim();
    if (query !== "") {
      axios
        .post(`/api/v1/search?query=${inputVal}`)
        .then((response) => {
          console.log(response.data);
          const files = response.data;

          const articleContainer = document.querySelector(".article-container");
          articleContainer.innerHTML = "";

          files.forEach((file) => {
            // Create file item elements and append to container
            const articleInfo = document.createElement("div");
            articleInfo.classList.add("article-info");

            const fileName = document.createElement("div");
            fileName.classList.add("file-name");
            fileName.textContent = file.filename;

            const bookIcon = document.createElement("div");
            bookIcon.innerHTML = '<ion-icon name="book-outline"></ion-icon>';
            bookIcon.classList.add("book-icon");

            articleInfo.appendChild(fileName);
            articleInfo.appendChild(bookIcon);
            articleContainer.appendChild(articleInfo);

            fileName.addEventListener("click", () => {
              window.location.href = `/view-article?id=${file._id}`;
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
});

//se.addEventListener("keydown", async (e) => {
//  if (e.key === "Enter") {
//    const searchTerm = e.target.value.trim();
//    const encodedSearchTerm = encodeURIComponent(searchTerm);
//
//    try {
//      const response = await axios.get(
//        `/api/v1/search?query=${encodedSearchTerm}`,
//      );
//      const files = response.data;
//
//      // Update the file list with the search results
//      const articleContainer = document.querySelector(".article-container");
//      articleContainer.innerHTML = "";
//
//      files.forEach((file) => {
//        // Create file item elements and append to container
//        const articleInfo = document.createElement("div");
//        articleInfo.classList.add("article-info");
//
//        const fileName = document.createElement("div");
//        fileName.classList.add("file-name");
//        fileName.textContent = file.filename;
//
//        const bookIcon = document.createElement("div");
//        bookIcon.innerHTML = '<ion-icon name="book-outline"></ion-icon>';
//        bookIcon.classList.add("book-icon");
//
//        articleInfo.appendChild(fileName);
//        articleInfo.appendChild(bookIcon);
//        articleContainer.appendChild(articleInfo);
//
//        fileName.addEventListener("click", () => {
//          window.location.href = `/view-article?id=${file._id}`;
//        });
//      });
//    } catch (error) {
//      console.error("Error fetching data:", error);
//    }
//  }
//});
//
// cool toggler tbh
function toggleVisibility(element, show) {
  element.style.display = show ? "block" : "none";
}

// capitalize first letter of filename
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
