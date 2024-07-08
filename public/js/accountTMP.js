const logoutBtn = document.querySelector(".logout-btn");

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.querySelector(".user-name");
  const adminIndicator = document.querySelector(".admin-indicator");
  const adminSection = document.querySelector(".admin-section");

  userName.innerText = "";
  adminIndicator.innerText = "";

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  if (user) {
    if (user.isAdmin === true) {
      adminSection.style.display = "block";
      adminIndicator.innerText = "Admin Mode";
    }
    userName.innerText = `${user.name} `;
  } else {
    userName.innerHTML = `
        <div>No account yet? Create an account <a href="/">here</a</div >
          `;
    logoutBtn.style.display = "none";
  }

  handleUpload(metadata);
});

// remove datas, tokens, and then redirect
logoutBtn.addEventListener("click", () => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    localStorage.removeItem("adminToken");
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
});

//const handleUpload = async (datas) => {
//  const { data } = await axios.post("/api/v1/upload/file");
//};

const handleUpload = async (file, metadata) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("metadata", JSON.stringify(metadata));

  const adminToken = localStorage.getItem("tokenAdmin");

  try {
    const { data } = await axios.post("/api/v1/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    console.log("Upload successful:", data);
    // Handle success (e.g., show a success message)
  } catch (error) {
    console.error("Upload failed:", error);
    // Handle error (e.g., show an error message)
  }
};
