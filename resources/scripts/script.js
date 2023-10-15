// Login-Registration
const login_register = document.querySelector(".login-register-container");
const login_link = document.querySelector(".login-link");
const register_link = document.querySelector(".register-link");
const login_popup = document.querySelector(".login-window");
const close_icon = document.querySelector(".icon-close");
const hide_item = document.querySelector(".container-1-item");

login_link.addEventListener("click", () => {
  login_register.classList.add("active");
});

register_link.addEventListener("click", () => {
  login_register.classList.remove("active");
});

login_popup.addEventListener("click", () => {
  login_register.classList.add("active-popup");
  hide_item.classList.add("hide");
});

close_icon.addEventListener("click", () => {
  login_register.classList.remove("active-popup");
  hide_item.classList.remove("hide");
});
