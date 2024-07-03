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

// submitting the regist form
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

  // validate input (this will not save the data to the db yet, not after the otp)
  await validateUserInput(formData);

  //const secretKey = await getSecretKey();
  // Get temp secret key from server
  const secretKey = await getTemporaryKey();

  // enc form data using the secret key
  const encrypted = encryptFormData(formData, secretKey);
  console.log("Encrypted Data: ", encrypted);

  // save the encrypted data to local storage
  localStorage.setItem("encFormData", encrypted);

  // if successful, redirect to the OTP verification page
  window.location.href = "./email-verification";
});

const getTemporaryKey = async () => {
  try {
    const response = await axios.get("api/v1/get-temp-key");
    const { tempKey } = response.data;
    return tempKey;
  } catch (error) {
    console.log(error);
  }
};

const validateUserInput = async (formData) => {
  try {
    const { data } = await axios.post(
      "api/v1/auth/validate-user-input",
      formData,
    );
    console.log("message: ", data);
  } catch (error) {
    console.log("error: ", error);
  }
};

const encryptFormData = (formData, secretKey) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(formData),
    secretKey,
  ).toString();
  return encrypted;
};

// notif library config
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

// EITHER USE THIS OR THE getTemporaryKey() function above
//async function generateSecretKey() {
//  const array = new Uint8Array(32);
//  window.crypto.getRandomValues(array);
//  const tempKey = Array.from(array, (byte) =>
//    ("0" + byte.toString(16)).slice(-2),
//  ).join("");
//
// Display the tempKey or do something with it
//  console.log(tempKey);
//  return tempKey;
//}

//  try {
//    const { data } = await axios.post("/api/v1/auth/register", formData);
//    const token = data.token;
//    localStorage.setItem("token", token);
//
//    // display success messages
//    toastr.success("Account created. Redirecting.", "Success");
//
//    setTimeout(() => {
//      window.location.href = "/login";
//    }, 2500);
//  } catch (error) {
//    if (error.response) {
//      toastr.error("Invalid credentials. Please try again.", "Error");
//      console.error(error);
//    }
//  }
