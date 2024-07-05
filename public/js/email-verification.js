//                      //
// OTP Input Management //
//                      //

class OTPInputs {
  constructor(inputs) {
    this.inputs = inputs;
  }

  setupListeners() {
    this.inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        if (input.value.length === 1) {
          const nextInput = this.inputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          } else {
            const otp = Array.from(this.inputs) // join the arr of inputs into one str to make a valid otp value
              .map((input) => input.value)
              .join("");
            if (
              Array.from(this.inputs).every((input) => input.value.length === 1)
            ) {
              if (formData && formData.email) {
                handleRegistration(otp); // grab the input values only if formdata is present
              } else {
                toastr.warning(
                  "Please fill out the registration form first.",
                  "Warning",
                );
                this.clearInputs();
              }
            }
          }
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
          if (input.value.length === 0) {
            const prevInput = this.inputs[index - 1];
            if (prevInput) {
              prevInput.focus();
              prevInput.value = "";
              e.preventDefault();
            }
          }
        }
      });
    });
  }

  clearInputs() {
    this.inputs.forEach((input) => (input.value = ""));
    this.inputs[0].focus();
  }
}

//               //
// API Functions //
//               //

async function getFormData() {
  // get the token for auth headers
  const formDataToken = localStorage.getItem("formDataToken");
  try {
    const { data } = await axios.get("/api/v1/tmp-form-data", {
      headers: {
        Authorization: `Bearer ${formDataToken}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateOTP(email) {
  try {
    const { data } = await axios.post("/api/v1/auth/generate-otp", { email });
    console.log("OTP Message: ", data.msg);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function verifyOTP(email, otp) {
  try {
    const { data: tempToken } = await axios.post("/api/v1/auth/verify-otp", {
      email,
      otp,
    });
    return tempToken;
  } catch (error) {
    console.error("verify otp error: ", error);
    throw error;
  }
}

//             //
// Main Script //
//             //

let otpAttempts = 0;
const MAX_OTP_ATTEMPTS = 3;

const inputs = document.querySelectorAll(".otp-input"); // all inputs elements
const otpInputs = new OTPInputs(inputs); // input values
let formData; // set form data as global

document.addEventListener("DOMContentLoaded", async () => {
  // clear input vals
  inputs.forEach((input) => (input.value = ""));
  // make input listeners active
  otpInputs.setupListeners();

  const otpMsgElems = document.querySelectorAll(".otp-msg");
  const displayUserEmailDOM = document.querySelector("#display-user-email");
  const warningMsg = document.querySelector(".otp-warning-msg");

  try {
    formData = await getFormData(); // fetch form data on page load
    if (formData) {
      // hide warning msg
      warningMsg.style.display = "none";

      //show elems
      displayUserEmailDOM.innerHTML = `We've sent a code to ${formData.email}`;
      otpMsgElems.forEach((msg) => {
        msg.style.display = "block";
      });
      inputs.forEach((input) => {
        input.style.display = "block";
      });
      resendOtp.style.display = "block";

      // generate and send otp to user email
      await generateOTP(formData.email);
    }
  } catch (error) {
    console.error("Error fetching form data:", error);
    //toastr.error("An error occurred. Please try again later.", "Error");
  }
});

async function handleRegistration(otp) {
  if (!formData || !formData.email) {
    toastr.warning("Please fill out the registration form first.", "Warning");
    return;
  }

  console.log("Sending API request with OTP:", otp);

  // check otp attempts
  if (otpAttempts === MAX_OTP_ATTEMPTS) {
    toastr.error("too many attempts. Please request a new code.", "Error");
    return;
  }

  // verify otp and register if successful
  try {
    const { tempToken } = await verifyOTP(formData.email, otp);
    console.log("temp token: ", tempToken);
    const verifyData = {
      ...formData,
      tempToken,
    };
    console.log("veriDataValue:", verifyData);
    const { data } = await axios.post("/api/v1/auth/register", verifyData);
    console.log("Registration successful:", data);

    localStorage.removeItem("formDataToken"); // remove the form data for security

    toastr.success("Registration successful! Redirecting.", "Success");
    setTimeout(() => {
      window.location.href = "/login"; // Redirect to login
    }, 3000);
  } catch (error) {
    console.error("Registration failed:", error);
    otpAttempts++;
    const remainingAttempts = MAX_OTP_ATTEMPTS - otpAttempts;

    if (error.response && error.response.status === 400) {
      switch (remainingAttempts) {
        case 2:
          toastr.error(
            `Incorrect code. ${remainingAttempts} attempts remaining.`,
            "Error",
          );
          break;
        case 1:
          toastr.error(
            `Incorrect code. ${remainingAttempts} attempt remaining.`, // nothing much just removed the "s" in attempts
            "Error",
          );
          break;
        case 0:
          toastr.error(
            "too many attempts. Please request a new code.",
            "Error",
          );
          break;
      }
    } else {
      toastr.error("An unexpected error occurred. Please try again.", "Error");
    }

    otpInputs.clearInputs();
  }
}

// resend OTP button
const resendOtpButton = document.getElementById("resendOtp");
resendOtpButton.addEventListener("click", async () => {
  if (!formData || !formData.email) {
    toastr.warning("Please fill out the registration form first.", "Warning");
    return;
  }

  try {
    await generateOTP(formData.email);
    toastr.success("New OTP sent successfully!", "Success");
    otpAttempts = 0; // Reset attempts counter
    otpInputs.clearInputs(); // clear inputs
  } catch (error) {
    console.error("Error resending OTP:", error);
    toastr.error(
      "An error occurred while resending OTP. Please try again.",
      "Error",
    );
  }
});

// toastr config
toastr.options = {
  progressBar: true,
  positionClass: "toast-right-middle",
  preventDuplicates: true,
  //showDuration: "300",
  //hideDuration: "1000",
  timeOut: "3000",
};
