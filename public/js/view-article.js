const loadingIndicator = document.querySelector(".loading-indicator");

const errorHandler = (error) => {
  console.error("Error occurred:", error);
  console.error("Error message:", error.message);
  console.error("Error response:", error.response);
  console.error("Error request:", error.request);

  if (error.response) {
    const { status, data } = error.response;
    console.error("Response status:", status);
    console.error("Response data:", data);

    if (status === 401) {
      loadingIndicator.style.display = "none";
      toastr.error("Unauthorized access.", "Error");
      localStorage.removeItem("token");
    } else {
      toastr.error(data.msg || "An error occurred", "Error");
    }
  } else if (error.request) {
    loadingIndicator.style.display = "none";
    toastr.error("No response from server. Please try again later.", "Error");
  } else {
    loadingIndicator.style.display = "none";
    toastr.error("An unexpected error occurred.", "Error");
  }
};

//const errorHandler = (error) => {
//  console.error("Error occurred:", error.message);
//
//  if (error.response) {
//    const { status, data } = error.response;
//    if (status === 401) {
//      // Handle unauthorized access
//      loadingIndicator.style.display = "none";
//      toastr.error("Unauthorized access.", "Error");
//      localStorage.removeItem("token");
//    } else {
//      toastr.error(data.msg, "Error");
//    }
//  } else if (error.request) {
//    loadingIndicator.style.display = "none";
//    toastr.error("No response from server. Please try again later.", "Error");
//  } else {
//    loadingIndicator.style.display = "none";
//    toastr.error("An unexpected error occurred.", "Error");
//  }
//};
//
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
      errorHandler(error);
    }
  }
});

async function fetchFile(fileId) {
  const token = localStorage.getItem("token");
  console.log(token);
  try {
    const response = await axios.get(`/api/v1/files/${fileId}`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

// configs for toastr
toastr.options = {
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2500",
};
