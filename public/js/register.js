const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const studentNumberInput = document.querySelector("#student-number-input");
const yearAndSectionInput = document.querySelector("#year-and-section-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

// clearing input values
document.addEventListener("DOMContentLoaded", function () {
  nameInput.value = "";
  emailInput.value = "";
  studentNumberInput.value = "";
  yearAndSectionInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";
});

toastr.options = {
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2500",
};

// WILL USE AGAIN AFTER SENDING PROPER VALIDATION ERRS TO FE
//const errorHandler = (error) => {
//  console.error(`Error: ${error.message}`);
//  console.error(`Error status: ${error.status}`);
//  console.error(`Error data: ${error.data}`);
//
//  if (error.response) {
//    toastr.error(error.response.data.msg, "Error");
//  } else if (error.request) {
//    toastr.error("No response from server. Please try again later.", "Error");
//  } else {
//    toastr.error("An unexpected error occurred.", "Error");
//  }
//};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    studentNumber: studentNumberInput.value,
    yearAndSection: yearAndSectionInput.value,
    password: passwordInput.value,
    confirmPassword: confirmPasswordInput.value,
  };

  try {
    const { data } = await axios.post("/api/v1/auth/register", formData);
    const token = data.token;
    localStorage.setItem("token", token);

    // display success messages
    toastr.success("Account created. Redirecting.", "Success");

    setTimeout(() => {
      window.location.href = "/login";
    }, 2500);
  } catch (error) {
    if (error.response) {
      toastr.error("Invalid credentials. Please try again.", "Error");
      console.error(error);
    }
  }
});
