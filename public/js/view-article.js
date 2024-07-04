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
        setTimeout(() => (window.location.href = "/login"), 3000); // Redirect to login page after 2 seconds
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
    toastr.info(error.message || "An unexpected error occurred", "Info");
    setTimeout(() => (window.location.href = "/login"), 3000);
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
    throw new Error("Please log in first to access files. Redirecting...");
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
    throw new Error(
      "Error loading PDF. The file might be corrupted or unsupported.",
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

// toastr config
toastr.options = {
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  //hideDuration: "1000",
  timeOut: "3000",
};

//const loadingIndicator = document.querySelector(".loading-indicator");
//
//const errorHandler = (error) => {
//  console.error("Error occurred:", error);
//
//  if (error.response) {
//    const { status, data } = error.response;
//    console.error(`Status: ${status}`);
//    console.error(`Data:`, data);
//
//    if (status === 401) {
//      toastr.error(data.message, data.error);
//      localStorage.removeItem("token");
//    } else {
//      toastr.error(data.message || "An error occurred", "Error");
//    }
//  } else if (error.request) {
//    console.error("No response received:", error.request);
//    toastr.error(
//      "No response from server. Please try again later.",
//      "Network Error",
//    );
//  } else {
//    console.error("Error:", error.message);
//    loadingIndicator.style.display = "none";
//    toastr.info("You need to create an account or login first.", "Info");
//  }
//};
//
//document.addEventListener("DOMContentLoaded", async () => {
//  // get id val in url
//  const urlParams = new URLSearchParams(window.location.search);
//  const fileId = urlParams.get("id");
//
//  if (fileId) {
//    try {
//      // fetch data and load pdf using that data
//      const pdfData = await fetchFile(fileId);
//      const pdf = await loadPDF(pdfData);
//
//      const pdfContainer = document.querySelector(".pdf-container");
//
//      // iterate and render
//      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//        await renderPage(pdf, pageNum, pdfContainer);
//
//        // hide elem
//        if (pageNum === 1) {
//          loadingIndicator.style.display = "none";
//        }
//      }
//    } catch (error) {
//      errorHandler(error);
//    }
//  }
//});
//
//async function fetchFile(fileId) {
//  const token = localStorage.getItem("token");
//  console.log(token);
//  try {
//    const response = await axios.get(`/api/v1/files/${fileId}`, {
//      responseType: "arraybuffer",
//      headers: {
//        Authorization: `Bearer ${token}`,
//      },
//    });
//    return new Uint8Array(response.data);
//  } catch (error) {
//    throw new Error("Error fetching file contents: " + error.message);
//  }
//}
//
//async function loadPDF(pdfData) {
//  try {
//    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//    const pdf = await loadingTask.promise;
//    return pdf;
//  } catch (error) {
//    throw new Error("Error loading PDF: " + error.message);
//  }
//}
//
//async function renderPage(pdf, pageNum, container) {
//  try {
//    const page = await pdf.getPage(pageNum);
//
//    const scale = 2; // higher scale === higher resolution (tho the page gets laggy around 2.3+)
//    const viewport = page.getViewport({ scale: scale });
//
//    // prepare canvas
//    const canvas = document.createElement("canvas");
//    canvas.classList.add("canvas");
//    container.appendChild(canvas);
//    const context = canvas.getContext("2d");
//    canvas.height = viewport.height;
//    canvas.width = viewport.width;
//
//    // render pdf
//    const renderContext = { canvasContext: context, viewport: viewport };
//    await page.render(renderContext).promise;
//  } catch (error) {
//    throw new Error(`Error rendering page ${pageNum}: ${error.message}`);
//  }
//}
//
//// configs for toastr
//toastr.options = {
//  positionClass: "toast-right-middle",
//  preventDuplicates: true,
//  showDuration: "300",
//  hideDuration: "1000",
//  timeOut: "2500",
//};
