// ... (keep the existing code up to the DOMContentLoaded event listener)

let otpAttempts = 0;
const MAX_OTP_ATTEMPTS = 3;
let formData;

document.addEventListener("DOMContentLoaded", async () => {
  inputs.forEach((input) => (input.value = ""));
  otpInputs.setupListeners();
  try {
    formData = await getFormData(); // fetch form data on page load
    if (formData && formData.email) {
      const displayUserEmailDOM = document.querySelector("#display-user-email");
      displayUserEmailDOM.innerHTML = `We've sent a code to ${formData.email}`;
      // generate and send otp
      await generateOTP(formData.email);
    } else {
      toastr.warning("Please fill out the registration form first.", "Warning");
    }
  } catch (error) {
    console.error("Error fetching form data:", error);
    toastr.error("An error occurred. Please try again later.", "Error");
  }
});

// Modify the OTPInputs class to include a check for formData
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
            const otp = Array.from(this.inputs)
              .map((input) => input.value)
              .join("");
            if (
              Array.from(this.inputs).every((input) => input.value.length === 1)
            ) {
              if (formData && formData.email) {
                handleRegistration(otp);
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

      // ... (keep the existing keydown event listener)
    });
  }

  clearInputs() {
    this.inputs.forEach((input) => (input.value = ""));
    this.inputs[0].focus();
  }
}

async function handleRegistration(otp) {
  if (!formData || !formData.email) {
    toastr.warning("Please fill out the registration form first.", "Warning");
    return;
  }

  console.log("Sending API request with OTP:", otp);

  if (otpAttempts >= MAX_OTP_ATTEMPTS) {
    toastr.error(
      "Maximum attempts reached. Please request a new OTP.",
      "Error",
    );
    return;
  }

  try {
    const tempToken = await verifyOTP(formData.email, otp);
    const verifyData = {
      formData,
      tempToken,
    };
    const { data } = await axios.post("/api/v1/auth/register", verifyData);
    console.log("Registration successful:", data);

    toastr.success("Registration successful!", "Success");
    setTimeout(() => {
      window.location.href = "/home"; // Redirect
    }, 3000);
  } catch (error) {
    console.error("Registration failed:", error);
    otpAttempts++;
    const remainingAttempts = MAX_OTP_ATTEMPTS - otpAttempts;

    if (error.response && error.response.status === 400) {
      toastr.error(
        `Incorrect OTP. ${remainingAttempts} attempts remaining.`,
        "Error",
      );
    } else {
      toastr.error("An unexpected error occurred. Please try again.", "Error");
    }

    // Clear OTP inputs
    otpInputs.clearInputs();
  }
}

// Modify the resend OTP button event listener
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
    otpInputs.clearInputs();
  } catch (error) {
    console.error("Error resending OTP:", error);
    toastr.error(
      "An error occurred while resending OTP. Please try again.",
      "Error",
    );
  }
});

// ... (keep the existing toastr config)
