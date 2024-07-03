async function sendApiRequest() {
  const inputs = document.querySelectorAll(".otp-input");
  const otp = Array.from(inputs)
    .map((input) => input.value)
    .join("");
  console.log("Sending API request with OTP:", otp);
  //await getFormData()
}

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".otp-input");

  // clear input values
  inputs.forEach((input) => (input.value = ""));

  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      if (this.value.length === 1) {
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          if (Array.from(inputs).every((input) => input.value.length === 1)) {
            sendApiRequest(); // if all the inputs has value exec fn
          }
        }
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace") {
        if (this.value.length === 0) {
          const prevInput = inputs[index - 1];
          if (prevInput) {
            prevInput.focus();
            prevInput.value = "";
            e.preventDefault();
          }
        }
      }
    });
  });
});
