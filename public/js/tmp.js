document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("/api/v1/files");
    const files = response.data;

    const filesContainer = document.querySelector(".files-container");
    filesContainer.innerHTML = "";

    // Iterate over files and create file items dynamically
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");
      fileItem.setAttribute("data-filename", file.filename);
      fileItem.textContent = file.filename;

      const previewElement = document.createElement("div");
      previewElement.classList.add("file-preview");
      previewElement.textContent = "Loading preview...";

      fileItem.appendChild(previewElement);

      fileItem.addEventListener("click", async () => {
        showFileContents(file.filename, previewElement);
      });

      filesContainer.appendChild(fileItem);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    alert("Failed to fetch files. Please try again later.");
  }
});

async function showFileContents(filename, previewElement) {
  const filesContainer = document.querySelector(".files-container");
  const fileContainer = document.getElementById("file-container");
  const loadingIndicator = document.querySelector(".loading-indicator");

  toggleVisibility(filesContainer, false);
  toggleVisibility(fileContainer, true);
  toggleVisibility(loadingIndicator, true);

  try {
    const pdfData = await fetchFile(filename);
    const pdf = await loadPDF(pdfData);
    const textContent = await extractTextFromPDF(pdf);

    // Display preview of the contents
    displayPreview(textContent, previewElement);

    // Render full PDF content
    const pdfContainer = document.createElement("div");
    pdfContainer.classList.add("pdf-container");

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      await renderPage(pdf, pageNum, pdfContainer);
    }

    // Clear previous PDF content if any
    fileContainer.innerHTML = "";
    fileContainer.appendChild(pdfContainer);

    toggleVisibility(loadingIndicator, false);
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
    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });

    const canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    container.appendChild(canvas);
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

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

function displayPreview(textContent, previewElement, previewLength = 200) {
  const preview =
    textContent.length > previewLength
      ? textContent.substring(0, previewLength) + "..."
      : textContent;
  previewElement.textContent = preview;
}

async function extractTextFromPDF(pdf) {
  let textContent = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const text = await page.getTextContent();
    textContent += text.items.map((item) => item.str).join(" ");
  }
  return textContent;
}
