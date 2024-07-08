const logoutBtn = document.querySelector(".logout-btn");

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.querySelector(".user-name");
  const adminIndicator = document.querySelector(".admin-indicator");
  const adminSection = document.querySelector(".admin-section");
  const uploadForm = document.querySelector(".upload-form");
  const numberDropdown = document.querySelector("#number-dropdown");

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
        <div>No account yet? Create an account <a href="/">here</a></div>
    `;
    logoutBtn.style.display = "none";
  }

  numberDropdown.addEventListener("change", () => {
    handleDropdownChange();
  });

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await handleUpload(formData);
  });

  //uploadForm.addEventListener("submit", async (e) => {
  //  e.preventDefault();
  //  formData = new FormData(e.target);
  //  metadata = {};
  //
  //  formData.forEach((value, key) => {
  //    if (key !== "files") {
  //      metadata[key] = value;
  //      formData.delete(key);
  //    }
  //  });
  //
  //  formData.append("metadata", metadata);
  //  console.log(formData);
  //  await handleUpload(formData);
  //});
});

const handleUpload = async (formData) => {
  const adminToken = localStorage.getItem("adminToken");
  try {
    const { data } = await axios.post("/api/v1/files/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    toastr.success("Upload Sccessful", "Success");
    console.log("Upload successful:", data);
    // Handle success (e.g., show a success message)
  } catch (error) {
    toastr.error("Something Went Wrong", "Error");
    console.error("Upload failed:", error);
    // Handle error (e.g., show an error message)
  }
};

// get references to elements
const numberDropdown = document.getElementById("number-dropdown");
const researcherContainer = document.getElementById("researcher-container");

function handleDropdownChange() {
  // clear previous additional inputs
  const additionalInputs = document.querySelectorAll(
    ".additional-researcher-form-control",
  );
  additionalInputs.forEach((input) => input.remove());

  // get selected number of researchers
  const numberOfResearchers = parseInt(numberDropdown.value, 10);

  // generate additional form control containers for researchers
  for (let i = 2; i <= numberOfResearchers; i++) {
    // Create form control container
    const formControl = document.createElement("div");
    formControl.classList.add(
      "researcher-form-control",
      "additional-researcher-form-control",
    );

    // create label element
    const label = document.createElement("label");
    label.setAttribute("for", `researcher-input-${i}`);
    label.textContent = `Researcher ${i}`;
    label.classList.add("upload-label");

    // create input element
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", `researcher-input-${i}`);
    input.setAttribute("name", `researcher-${i}`);
    input.classList.add("upload-input");

    // append label and input to form control container
    formControl.appendChild(label);
    formControl.appendChild(input);

    // append form control container to researcherContainer
    researcherContainer.appendChild(formControl);
  }
}

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

// toastr config
toastr.options = {
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  //hideDuration: "1000",
  timeOut: "3000",
};
