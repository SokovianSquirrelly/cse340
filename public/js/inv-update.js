const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector(".submit-button");
  updateBtn.removeAttribute("disabled");
});
