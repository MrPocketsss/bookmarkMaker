const { app, BrowserWindow } = require("electron");

// Creates a variable in the top-level scope for the main window of our application
let mainWindow = null;

// Called as soon as the application has fully launched
app.on("ready", () => {
  console.log("Hello from Electron");

  // When the application is ready, creates a browser window, and assigns it to the variable
  // created in the top-level scope.
  mainWindow = new BrowserWindow();

  // Tells the browser window to load an HTML file located in the same directory as the main process
  mainWindow.webContents.loadURL(`file://${__dirname}/index.html`);
});
