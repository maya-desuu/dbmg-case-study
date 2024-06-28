document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("/api/v1/files");
    console.log("all file data: ", response.data);
    const files = response.data;

    // Clear existing content in files container
    const filesContainer = document.querySelector(".files-container");
    const filesList = document.querySelector(".files-list");
    filesList.innerHTML = "";

    // Iterate over files and create file items dynamically
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");
      fileItem.setAttribute("data-filename", file.filename);
      fileItem.textContent = file.filename;

      //const fileContent = document.createElement("div");
      //fileContent.classList.add("file-content");
      //fileContent.id = `content-${file.filename}`;
      //fileItem.appendChild(fileContent);

      fileItem.addEventListener("click", () => {
        showFileContents(file.filename);
      });
      // append file item to container after each loop
      filesList.appendChild(fileItem);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    alert("Failed to fetch files. Please try again later.");
  }
});

async function showFileContents(filename) {
  const filesContainer = document.querySelector(".files-container");
  const pdfContainer = document.querySelector(".pdf-container");
  const loadingIndicator = document.querySelector("#loading-indicator");

  // Hide file list and show PDF container
  filesContainer.style.display = "none";
  pdfContainer.style.display = "block";

  // Show loading cue
  loadingIndicator.style.display = "block";

  try {
    const response = await axios.get(`/api/v1/files/${filename}`, {
      responseType: "arraybuffer", // Specify response type as arraybuffer to handle binary data such as PDF
    });
    console.log("Response data: ", response.data);

    // Convert the response to a Uint8Array
    const pdfData = new Uint8Array(response.data);
    console.log("PDF data: ", pdfData);

    // Function to render each page
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(
      async (pdf) => {
        console.log("PDF loaded");

        // Load and render the page
        const renderPage = async (pageNum) => {
          pdf.getPage(pageNum).then(async (page) => {
            console.log("Page loaded");

            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            // Prepare the canvas
            const canvas = document.createElement("canvas");
            pdfContainer.appendChild(canvas);
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render the page into the canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise.then(() => {
              loadingIndicator.style.display = "none";
              canvas.style.display = "block";
            });
            console.log(`Page ${pageNum} rendered`);
          });
        };

        // Loop through all pages and render them
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          renderPage(pageNum);
        }
      },
      (reason) => {
        console.error(reason);
        alert("Failed to load PDF. Please try again.");
      },
    );
  } catch (error) {
    console.error("Error fetching file contents:", error);
    alert("Failed to fetch PDF contents. Please try again.");
  }
}
