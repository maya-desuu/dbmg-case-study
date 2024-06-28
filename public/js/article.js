const loadingIndicator = document.querySelector(".loading-indicator");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("/api/v1/files");
    const files = response.data;

    // Clear existing content in files container
    const filesContainer = document.querySelector(".files-container");
    filesContainer.innerHTML = "";

    // hide once dom is loaded
    toggleVisibility(loadingIndicator, false);

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
      filesContainer.appendChild(fileItem);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    alert("Failed to fetch files. Please try again later.");
  }
});

async function showFileContents(filename) {
  const filesContainer = document.querySelector(".files-container");
  const pdfContainer = document.querySelector(".pdf-container");
  const seContainer = document.querySelector(".se-container");

  // hide elems
  toggleVisibility(filesContainer, false);
  toggleVisibility(seContainer, false);

  // show loading cue
  toggleVisibility(loadingIndicator, true);
  try {
    const pdfData = await fetchFile(filename);
    const pdf = await loadPDF(pdfData);

    // loop through each page and render them
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      await renderPage(pdf, pageNum, pdfContainer).then();

      //hide the loading cue if the first page finished loading
      if (pageNum === 1) {
        toggleVisibility(loadingIndicator, false);
      }
    }
  } catch (error) {
    console.error("Error fetching or rendering file contents:", error);
    alert("Failed to render PDF contents. Please try again later.");
  }
}

async function fetchFile(filename) {
  try {
    const response = await axios.get(`/api/v1/files/${filename}`, {
      responseType: "arraybuffer",
    });
    //console.log("Response Data: ", response.data);
    return new Uint8Array(response.data);
  } catch (error) {
    throw new Error("Error fetching file contents: " + error.message);
  }
}

async function loadPDF(pdfData) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    return pdf;
  } catch (error) {
    throw new Error("Error loading PDF: " + error.message);
  }
}

async function renderPage(pdf, pageNum, container) {
  try {
    const page = await pdf.getPage(pageNum);
    console.log("Page loaded");

    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });

    //// Set a fixed width for the canvas and adjust the scale accordingly
    //const fixedWidth = 1200;
    //const viewport = page.getViewport({ scale: 1 });
    //const scale = fixedWidth / viewport.width;
    //const scaledViewport = page.getViewport({ scale: scale });

    // Prepare the canvas
    const canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    container.appendChild(canvas);
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the page into the canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  } catch (error) {
    throw new Error(`Error rendering page ${pageNum}: ${error.message}`);
  }
}

function toggleVisibility(element, show) {
  element.style.display = show ? "block" : "none";
}
