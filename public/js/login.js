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
    const { token, user } = data;
    console.log(user);
    console.log(token);
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ name: user.name, isAdmin: user.isAdmin }),
    );

    window.location.href = "/home";
  } catch (error) {
    errorHandler(error);
  }
});

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

// configs for toastr
toastr.options = {
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2500",
};
