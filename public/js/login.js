const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// clearing input values
document.addEventListener("DOMContentLoaded", function () {
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
});

// configs for toastr
toastr.options = {
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2500",
};

const errorHandler = (error) => {
  console.error("Error occurred:", error.message);

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
    const { token } = data;
    localStorage.setItem("token", token);

    // Instead of window.location.href, call a function to handle redirection
    redirectToHome(token);
  } catch (error) {
    // Handle login error
    console.error("Login error:", error);
  }
});

async function redirectToHome(token) {
  try {
    // Make an authenticated request to /home
    const response = await axios.get("/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If the request is successful, redirect to /home
    window.location.href = "/home";
  } catch (error) {
    // Handle any errors
    console.error("Error redirecting to home:", error);
    // You might want to show an error message to the user here
  }
}

//form.addEventListener("submit", async (e) => {
//  e.preventDefault();
//
//  // input values
//  const formData = {
//    name: nameInput.value,
//    email: emailInput.value,
//    password: passwordInput.value,
//  };
//
//  try {
//    const { data } = await axios.post("/api/v1/auth/login", formData);
//    console.log(data);
//    const { token } = data;
//    localStorage.setItem("token", token);
//
//    window.location.href = "/home";
//  } catch (error) {
//    errorHandler(error);
//  }
//});
