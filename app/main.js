const { app } = require("electron");

// Called as soon as the application has fully launched
app.on("ready", () => {
  console.log("Hello from Electron");
});
