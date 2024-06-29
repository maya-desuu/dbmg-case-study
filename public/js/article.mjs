const loadingIndicator = document.querySelector(".loading-indicator");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("/api/v1/files");
    const files = response.data;

    // Clear existing content in files container
    const filesContainer = document.querySelector(".files-container");
    filesContainer.innerHTML = "";

    // hide elem once dom is loaded
    toggleVisibility(loadingIndicator, false);

    // Iterate over files and create file items dynamically
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");
      fileItem.setAttribute("data-id", file._id);
      fileItem.textContent = file.filename;

      //const fileContent = document.createElement("div");
      //fileContent.classList.add("file-content");
      //fileContent.id = `content-${file.filename}`;
      //fileItem.appendChild(fileContent);

      fileItem.addEventListener("click", () => {
        window.location.href = `/view-article?id=${file._id}`; // onclick redirect to view-article add the id to the url :)
      });
      // append file item to container after each loop
      filesContainer.appendChild(fileItem);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    alert("Failed to fetch files. Please try again later.");
  }
});

// cool toggler tbh
function toggleVisibility(element, show) {
  element.style.display = show ? "block" : "none";
}
