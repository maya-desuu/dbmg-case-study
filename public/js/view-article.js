const loadingIndicator = document.querySelector(".loading-indicator");

document.addEventListener("DOMContentLoaded", async () => {
  // get id val in url
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get("id");

  if (fileId) {
    try {
      // fetch data and load pdf using that data
      const pdfData = await fetchFile(fileId);
      const pdf = await loadPDF(pdfData);

      const pdfContainer = document.querySelector(".pdf-container");

      // iterate and render
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        await renderPage(pdf, pageNum, pdfContainer);

        // hide elem
        if (pageNum === 1) {
          loadingIndicator.style.display = "none";
        }
      }
    } catch (error) {
      console.error("Error fetching or rendering file contents:", error);
      alert("Failed to render PDF contents. Please try again later.");
    }
  }
});

async function fetchFile(fileId) {
  try {
    const response = await axios.get(`/api/v1/files/${fileId}`, {
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

    const scale = 2; // higher scale === higher resolution (tho the page gets laggy around 2.5+)
    const viewport = page.getViewport({ scale: scale });

    // prepare canvas
    const canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    container.appendChild(canvas);
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // render pdf
    const renderContext = { canvasContext: context, viewport: viewport };
    await page.render(renderContext).promise;
  } catch (error) {
    throw new Error(`Error rendering page ${pageNum}: ${error.message}`);
  }
}
