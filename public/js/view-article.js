const loadingIndicator = document.querySelector(".loading-indicator");

const errorHandler = (error) => {
  console.error("Error occurred:", error);
  loadingIndicator.style.display = "none";

  if (error.response) {
    const { status, data } = error.response;
    console.error(`Status: ${status}`);
    console.error(`Data:`, data);

    switch (status) {
      case 401:
        toastr.error(
          data.message || "Unauthorized access",
          "Authentication Error",
        );
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 3000);
        break;
      case 403:
        toastr.errorr(
          data.message || "You don't have permission to access this file",
          "Access Denied",
        );
        break;
      case 404:
        toastr.error(
          data.message || "The requested file was not found",
          "File Not Found",
        );
        break;
      default:
        toastr.error(
          data.message || "An unexpected error occurred",
          `Error ${status}`,
        );
    }
  } else if (error.request) {
    console.error("No response received:", error.request);
    toastr.error(
      "No response from server. Please check your internet connection and try again.",
      "Network Error",
    );
  } else {
    console.error("Error:", error.message);
    //toastr.error(error.message || "An unexpected error occurred", "Error");
    //setTimeout(() => (window.location.href = "/login"), 3000);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get("id");

  if (!fileId) {
    toastr.error("No file ID provided", "Error");
    loadingIndicator.style.display = "none";
    return;
  }

  try {
    // fetch fileId from server
    const pdfData = await fetchFile(fileId);

    // load pdf
    const pdf = await loadPDF(pdfData);

    const pdfContainer = document.querySelector(".pdf-container");

    // iterate all pages and rendem them
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      await renderPage(pdf, pageNum, pdfContainer);

      // hide loading cue if first page is rendered
      if (pageNum === 1) {
        loadingIndicator.style.display = "none";
      }
    }

    //toastr.success("PDF loaded successfully", "Success"); // nah
  } catch (error) {
    errorHandler(error);
  }
});

async function fetchFile(fileId) {
  const token = localStorage.getItem("token");
  if (!token) {
    toastr.error("Please log in first to access files. Redirecting.", "Error");
    setTimeout(() => (window.location.href = "/login"), 3000);
    //throw new Error("Please log in first to access files. Redirecting.");
  }

  try {
    const response = await axios.get(`/api/v1/files/${fileId}`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return new Uint8Array(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }
    throw error;
  }
}

async function loadPDF(pdfData) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    return await loadingTask.promise;
  } catch (error) {
    toastr.error(
      "Error loading PDF. The file might be corrupted or unsupported.",
      "Error",
    );
  }
}

async function renderPage(pdf, pageNum, container) {
  try {
    const page = await pdf.getPage(pageNum);

    const scale = 2; // higher scale === higher resolution (at the cost of lag)
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
    throw new Error(
      `Error rendering page ${pageNum}. The PDF might be corrupted.`,
    );
  }
}

document.addEventListener("contextmenu", (event) => event.preventDefault());
const pdfContainer = document.querySelector(".pdf-container");
pdfContainer.addEventListener("mousedown", (event) => {
  if (event.button === 2) event.preventDefault();
});

// toastr config
toastr.options = {
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
};
