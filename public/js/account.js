const logoutBtn = document.querySelector(".logout-btn");

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.querySelector(".user-name");
  const adminIndicator = document.querySelector(".admin-indicator");
  const adminSection = document.querySelector(".admin-section");

  userName.innerText = "";
  adminIndicator.innerText = "";

  const user = JSON.parse(localStorage.getItem("user"));
  //console.log(user);

  if (user) {
    if (user.isAdmin === true) {
      adminSection.style.display = "block";
      adminIndicator.innerText = "Admin Mode";
    }
    userName.innerText = `${user.name} `;
  } else {
    userName.innerHTML = `
        <div>No account yet? Create an account <a href="/">here</a</div >
          `;
    logoutBtn.style.display = "none";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
});
