const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const studentNumberInput = document.querySelector("#student-number-input");
const yearAndSectionInput = document.querySelector("#year-and-section-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

//clearing input values
document.addEventListener("DOMContentLoaded", function () {
  nameInput.value = "";
  emailInput.value = "";
  studentNumberInput.value = "";
  yearAndSectionInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // get input vals
  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    studentNumber: studentNumberInput.value,
    yearAndSection: yearAndSectionInput.value,
    password: passwordInput.value,
    confirmPassword: confirmPasswordInput.value,
  };

  try {
    // validate user input
    await validateUserInput(formData);

    // store form input temporarily
    const token = await storeTmpFormData(formData);

    if (!token) {
      throw new Error("Failed to receive token from server");
    }

    localStorage.setItem("formDataToken", token);

    // redirect to otp page
    window.location.href = "./email-verification";
  } catch (error) {
    console.error("Error in form submission:", error.message);
    //toastr.error(error.message, "Error");
  }
});

const validateUserInput = async (formData) => {
  try {
    const { data } = await axios.post(
      "api/v1/auth/validate-user-input",
      formData,
    );
    console.log("Validation message:", data);
    return data;
  } catch (error) {
    console.error();
    handleError();
  }
};

const storeTmpFormData = async (formData) => {
  try {
    const { data } = await axios.post("api/v1/tmp-form-data", formData);
    if (!data.token) {
      throw new Error("Token not received from server");
    }
    return data.token;
  } catch (error) {
    handleError();
  }
};

const handleError = (error) => {
  console.error("Error:", error);

  toastr.error(
    error.response?.data?.error ||
      "An unexpected error occurred. Please try again.",
    "Error",
  );
  throw error;
};

// toastr config
toastr.options = {
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  showDuration: "300",
  //hideDuration: "1000",
  timeOut: "3000",
};
