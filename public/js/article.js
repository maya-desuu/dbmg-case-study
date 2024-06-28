document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("/api/v1/files");
    console.log("all file data: ", response.data);
    const files = response.data;

    // Clear existing content in files container
    const filesContainer = document.querySelector(".files-container");
    filesContainer.innerHTML = "";

    // Iterate over files and create file items dynamically. (could've used files.forEach() tho its def cooler this way)
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
        windows.href = `.../views/viewPDF.ejs?id=${file._id}`;
        showFileContents(file.filename);
      });
      // insert file item to container after each loop
      filesContainer.appendChild(fileItem);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    alert("Failed to fetch files. Please try again later.");
  }
});

async function showFileContents(filename) {
  const loadingIndicator = document.getElementById("loading-indicator"); // loading cue
  const canvas = document.getElementById("pdf-canvas"); // grab canvas elem
  loadingIndicator.style.display = "block";
  //canvas.style.display = "none";
  try {
    const response = await axios.get(`/api/v1/files/${filename}`, {
      responseType: "arraybuffer", // specify response type as arraybuffer to handle binary data such as ofc PDF
    });
    console.log("response data: ", response.data);

    // Convert the response to a Blob
    const pdfData = new Uint8Array(response.data);
    console.log("pdf data: ", pdfData);

    // render the PDF content (used pdf.js for rendering pdf's, great docs too)
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(
      (pdf) => {
        console.log("PDF loaded");

        // Fetch the first page
        pdf.getPage(1).then((page) => {
          console.log("Page loaded");

          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });

          // Prepare the canvas
          const canvas = document.getElementById("pdf-canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render the page into the canvas context
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          page.render(renderContext).promise.then(() => {
            console.log("Page rendered");
            loadingIndicator.style.display = "none";
            canvas.style.display = "block";
          });
        });
      },
      function (reason) {
        console.error(reason);
        alert("Failed to render PDF. Please try again.");
      },
    );
  } catch (error) {
    console.error("Error fetching file contents:", error);
    alert("Failed to fetch file contents. Please try again.");
  }
}
