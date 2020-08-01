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
    .then(renderLinks);
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

// Retrieves links from local storage
const getLinks = () => {
  return Object.keys(localStorage) // gets an array of all the keys in local storage
               .map(key => JSON.parse(localStorage.getItem(key))); // from each key, get its value and parse it into JSON
}

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
  `
}

// Collects all links, concatenates them and replaces the linkSection element in index.html
const renderLinks = () => {
  // Converts all links into HTML elements and combines them
  const linkElements = getLinks().map(convertToElement).join('');

  // Replaces the contents of the links section with the combined link elements
  linksSection.innerHTML = linkElements;
}

// render any links as soon as the page loads
renderLinks();