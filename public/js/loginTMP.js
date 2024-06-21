const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// Clearing input values
document.addEventListener("DOMContentLoaded", function() {
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";

  // Manually adding the placeholder for email input (firefox removing it after removing input values)
  //emailInput.placeholder = "example@gmail.com";
});

// Configs for toastr. Library used for alert messages
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
    password: passwordInput.value,
  };

  try {
    const { data } = await axios.post("/api/v1/auth/login", formData);
    console.log(data);
    localStorage.setItem("token", data.token);

    // Authenticate token
    accessHomeRoute();

    // Show alert messages
    toastr.success("Redirecting To Home Page", "Success");
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      toastr.error(error.response.data.msg || "An error occurred", "Error");
    } else if (error.request) {
      console.error("Error request:", error.request);
      toastr.error("No response from server. Please try again later.", "Error");
    } else {
      console.error("Error message:", error.message);
      toastr.error("An unexpected error occurred: " + error.message, "Error");
    }
  }
});

const accessHomeRoute = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.get("/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toastr.success("Success");

    // Redirect to /home if the request is successful
    setTimeout(() => {
      window.location.href = "/home";
    }, 2500);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);

      if (error.response.status === 401) {
        // Redirect to login page or show access denied message
        toastr.error("Unauthorized access. Please login again.", "Error");
        localStorage.removeItem("token");
      } else {
        toastr.error(error.response.data.msg || "An error occurred", "Error");
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      toastr.error("No response from server. Please try again later.", "Error");
    } else {
      console.error("Error message:", error.message);
      toastr.error("An unexpected error occurred: " + error.message, "Error");
    }
  }
};
