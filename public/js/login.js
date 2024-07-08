const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");

// clearing input values
document.addEventListener("DOMContentLoaded", function () {
  emailInput.value = "";
  passwordInput.value = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // input values
  const formData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const { data } = await axios.post("/api/v1/auth/login", formData);
    //const { user } = data;
    //console.log(user);

    if (data.adminToken) {
      const adminToken = localStorage.setItem("adminToken", data.adminToken);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.user.name, isAdmin: data.user.isAdmin }),
      );
      console.log("adminToken", data.adminToken);
    } else {
      localStorage.setItem("token", data.token); // user token (too lazy to update values in all diff files)
      localStorage.setItem("user", JSON.stringify({ name: data.user.name }));
    }

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
