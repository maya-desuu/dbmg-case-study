//document.addEventListener("DOMContentLoaded", async () => {
//  try {
//    const response = await axios.get("/files/all");
//    const files = response.data;
//    // Render files using EJS template
//    const filesContainer = document.querySelector(".files-container");
//    filesContainer.innerHTML = `<%= include('files.ejs', { files: files }) %>`;
//  } catch (error) {
//    console.error("Error fetching files:", error);
//    alert("Failed to fetch files. Please try again.");
//  }
//});
//
//async function showFileContents(filename) {
//  try {
//    const response = await axios.get(`/files/${filename}`);
//    const contentElement = document.getElementById(`content-${filename}`);
//    contentElement.textContent = response.data;
//    contentElement.style.display = "block";
//  } catch (error) {
//    console.error("Error fetching file contents:", error);
//    alert("Failed to fetch file contents. Please try again.");
//  }
//}
