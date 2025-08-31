// Dark / Light mode toggle
const toggleMode = document.getElementById("toggle-mode");
const toggleLight = document.getElementById("toggle-light");

toggleMode?.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("light-mode");
});

toggleLight?.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("light-mode");
});
