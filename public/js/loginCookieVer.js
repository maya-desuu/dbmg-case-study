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

// configs for toastr
toastr.options = {
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2500",
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
    accessProtectedHomeRoute(data.token, data.redirectUrl);

    // display alert
    //toastr.success("Log-in successful. Redirecting.");

    // redirect
  } catch (error) {
    errorHandler(error);
  }
});

const accessProtectedHomeRoute = async (token, redirectUrl) => {
  try {
    setCookie("token", token, 30); // Store token in a cookie for 30 days
    //toastr.success("Log-in successful. Redirecting.");
    window.location.href = "/home"; // Redirect to home

    //const authAxios = axios.create({
    //  headers: {
    //    Authorization: `Bearer ${token}`,
    //  },
    //});
    //
    //await authAxios.get("/home");
  } catch (error) {
    errorHandler(error);
    window.location.href = "/login";
    localStorage.removeItem("token");
  }
};

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=None;Secure`;
}
