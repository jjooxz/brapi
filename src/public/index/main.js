const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
});