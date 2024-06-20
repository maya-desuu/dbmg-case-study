const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const studentNumberInput = document.querySelector("#student-number-input");
const yearAndSectionInput = document.querySelector("#year-and-section-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

// configs for toastr. Library used for alert messages
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  onShown: function() {
    if ($(".toast").length > 3) {
      $(".toast:first").remove(); // Remove the oldest notification
    }
  },
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
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
    localStorage.setItem("token", data.token);

    toastr.success("Account created. Redirecting.", "Success");

    //nameInput.value = "";
    //emailInput.value = "";
    //studentNumberInput.value = "";
    //yearAndSectionInput.value = "";
    //passwordInput.value = "";
    //confirmPasswordInput.value = "";

    setTimeout(() => {
      window.location.href = "/login";
    }, 2500); // 2.5 secs delay
  } catch (error) {
    toastr.error("Invalid credentials. Please try again", "Error");
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    }
  }
});
