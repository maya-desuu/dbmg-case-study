const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const studentNumberInput = document.querySelector("#student-number-input");
const yearAndSectionInput = document.querySelector("#year-and-section-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

// clearing input values
document.addEventListener("DOMContentLoaded", function() {
  nameInput.value = "";
  emailInput.value = "";
  studentNumberInput.value = "";
  yearAndSectionInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";

  // manually adding the placeholder for email input (firefox removing it after removing input values)
  //emailInput.placeholder = "example@gmail.com";
});

// configs for toastr. Library used for alert messages
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "0",
  timeOut: "2500",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

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
    console.log(data);

    // display success messages
    toastr.success("Account created. Redirecting.", "Success");

    setTimeout(() => {
      window.location.href = "/login";
    }, 2500);
  } catch (error) {
    // display err messages
    toastr.error("Invalid credentials. Please try again.", "Error");

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    }
  }
});
