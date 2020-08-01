// We need this to pass the bookmark, if clicked, to the users default browser
const { shell } = require("electron");

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
    .then(validateResponse) // maks sure response is good
    .then((response) => response.text()) // parses the response as plain text
    .then(parseResponse)
    .then(findTitle)
    .then((title) => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks)
    .catch((error) => handleError(error, url)); // If promis in this chain rejects or throws an error, catches the error and displays it in the UI
});

// Clears the local storage of any links
clearStorageButton.addEventListener("click", () => {
  // clears local storage
  localStorage.clear();

  //removes the links from the UI
  linksSection.innerHTML = "";
});

// Do this when a user clicks on a bookmark link
linkSection.addEventListener("click", (event) => {
  // If the element was a link
  if (event.target.href) {
    // Don't open it ourselves
    event.preventDefault();

    // Use shell module to open in user's default browser
    shell.openExternal(event.target.href);
  }
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
const storeLink = (title, url) => {
  localStorage.setItem(url, JSON.stringify({ title, url }));
};

// Retrieves links from local storage
const getLinks = () => {
  return Object.keys(localStorage) // gets an array of all the keys in local storage
    .map((key) => JSON.parse(localStorage.getItem(key))); // from each key, get its value and parse it into JSON
};

// Converts from plain text to DOM nodes
// *DOES NOT* sanitize
const convertToElement = (link) => {
  return `
    <div class="link">
      <h3>${link.title}</h3>
      <p>
        <a href="${link.url}">${link.url}</a>
      </p>
    </div>
  `;
};

// Collects all links, concatenates them and replaces the linkSection element in index.html
const renderLinks = () => {
  // Converts all links into HTML elements and combines them
  const linkElements = getLinks().map(convertToElement).join("");

  // Replaces the contents of the links section with the combined link elements
  linksSection.innerHTML = linkElements;
};

// This is the catch clause of the fetch call in newLinkForm.listener
const handleError = (error, url) => {
  // Sets the contents of the error message element if fetching a link fails
  errorMessage.innerHTML = `
    There was an issue adding "${url}": ${error.message}
  `.trim();
  // Clears the error message after 5 seconds
  setTimeout(() => (errorMessage.innerText = null), 5000);
};

// This validates response or throws an error - short-circuiting the fetch promise chain
const validateResponse = (response) => {
  // If response successful, continue
  if (response.ok) return response;

  // Throws an error if the request received a 400-500 series response
  throw new Error(`Status code of ${response.status} ${response.statusText}`);
};

// render any links as soon as the page loads
renderLinks();
