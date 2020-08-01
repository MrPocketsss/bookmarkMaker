// Creates a DOMParser instance. We use this after fetching the text contents from the provided url
const parser = new DOMParser();

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

newLinkForm.addEventListener("submit", (event) => {
  // Tells Chromium not to trigger an HTTP request (the default action for form submission)
  event.preventDefault();

  // Grabs the URL in the new link input field.
  const url = newLinkUrl.value;

  fetch(url) // Uses the fetch API to fetch the content of the provided url
    .then((response) => response.text()) // parses the response as plain text
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
});

// Clears the value of the new link input field by setting the value to null
const clearForm = () => {
  newLinkUrl.value = null;
};

// Takes the string of HTML from the URL and parses into a DOM tree
const parseResponse = (text) => {
  return parser.parseFromString(text, "text/html");
};

// Traverses the DOM tree to find the <title> node
const findTitle = (nodes) => {
  return nodes.querySelector("title").innerText;
};

// Stores the title and URL into local storage
const storeLink = (title, url) {
  localStorage.setItem(url, JSON.stringify({ title, url}));
}