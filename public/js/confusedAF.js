// Arrow function for handling form submission
const handleFormSubmit = async (formData) => {
  try {
    const { data } = await axios.post("/api/v1/auth/login", formData);
    console.log(data);

    // Store token securely
    localStorage.setItem("token", data.token);

    // Optionally redirect or show success message
    // toastr.success("Login successful");

    // Example redirection after login
    // setTimeout(() => {
    //   window.location.href = "/home";
    // }, 1000);

    // Access protected route after login (example)
    await accessProtectedRoute();
  } catch (error) {
    console.error("Login error:", error);

    // Show error message to user
    toastr.error("Invalid credentials. Please try again.", "Error");

    // Clear token in case of error
    localStorage.removeItem("token");
  }
};

// Event listener using arrow function for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  await handleFormSubmit(formData);
});

// Example: Arrow function for accessing protected routes
const accessProtectedRoute = async () => {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.get("/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
  } catch (error) {
    console.error("Access error:", error);

    // Handle unauthorized access or other errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page or show access denied message
      // toastr.error("Unauthorized access. Please login again.");
    }
  }
};
