const linksSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-message");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkUrl = document.querySelector(".new-link-url");
const newLinkSubmit = document.querySelector(".new-link-submit");
const clearStorageButton = document.querySelector(".clear-storage");

newLinkUrl.addEventListener("keyup", () => {
  // When a user types in the input field, this uses Chromium's ValidityState API
  // to determine if the input is valid. If so, removes the disabled attribute
  // from the submit button
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

// Clears the value of the new link input field by setting the value to null
const clearForm = () => {
  newLinkUrl.value = null;
};
