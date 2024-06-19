const axios = require("axios");

const form = document.querySelector(".form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const studentNumberInput = document.querySelector("#student-number-input");
const yearAndSectionInput = document.querySelector("#year-and-section-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const studentNumber = studentNumberInput.value;
  const yearAndSection = yearAndSectionInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  try {
    const { data } = await axios.post("/api/v1/auth/register", {
      name,
      email,
      studentNumber,
      yearAndSection,
      password,
      confirmPassword,
    });
    localStorage.setItem("token", data.token);
  } catch (error) {
    localStorage.getItem("token");
    console.log(error.response.data.msg);
  }
});
