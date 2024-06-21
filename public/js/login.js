const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// clearing input values
document.addEventListener("DOMContentLoaded", function() {
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
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

const errorHandler = (error) => {
  console.error(`Error: ${error.message}`);
  console.error(`Error status: ${error.status}`);
  console.error(`Error data: ${error.data}`);

  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      // Handle unauthorized access
      toastr.error("Unauthorized access.", "Error");
      localStorage.removeItem("token");
    } else {
      toastr.error(data.msg, "Error");
    }
  } else if (error.request) {
    toastr.error("No response from server. Please try again later.", "Error");
  } else {
    toastr.error("An unexpected error occurred.", "Error");
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // input values
  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const { data } = await axios.post("/api/v1/auth/login", formData);
    console.log(data);
    localStorage.setItem("token", data.token);

    // Authenticate token and access home route if successful
    accessProtectedHomeRoute();
  } catch (error) {
    errorHandler(error);
  }
});

const accessProtectedHomeRoute = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.get("/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};
