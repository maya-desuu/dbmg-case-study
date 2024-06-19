const axios = require("axios");

const form = docucment.querySelector(".form");
const nameInput = docucment.querySelector("#name-input");
const emailInput = docucment.querySelector("#email - input");
const studentNumberInput = docucment.querySelector("#student-number-input");
const yearAndSectionInput = docucment.querySelector("#year-and-section-input");
const passwordInput = docucment.querySelector("#password-input");
const confirmPasswordInput = docucment.querySelector("#confirm-password-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput;
  const email = emailInput;
  const studentNumber = studentNumberInput;
  const yearAndSection = yearAndSectionInput;
  const password = passwordInput;
  const confirmPassword = confirmPasswordInput;

  try {
    const { data } = await axios.post("/api/v1/auth/register", {
      name,
      email,
      studentNumber,
      yearAndSection,
      password,
      confirmPassword,
    });
  } catch (error) {}
});
