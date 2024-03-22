const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  console.log("Is this even happening?");
  const updateBtn = document.querySelector(".submit-button");
  updateBtn.removeAttribute("disabled");
});
