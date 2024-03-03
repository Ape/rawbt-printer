function showError(message) {
  const element = document.getElementById("errorAlert");

  console.error(message);
  element.textContent = message;
  element.classList.add("show");
  document.getElementById("errorContainer").classList.remove("d-none");
}

function hideError() {
  document.getElementById("errorContainer").classList.add("d-none");
}

function makeCommand() {
  return {
    command: "print",
    text: document.getElementById("text").value,
    attributesString: {
      printerFont: 4, // TrueType font
      alignment: document.getElementById("alignment").value,
      truetypeFontSize: document.getElementById("fontsize").value,
      bold: document.getElementById("bold").checked,
    },
  };
}

function printRawbt(job){
  hideError();

  const socket = new WebSocket("ws://localhost:40213/");

  socket.addEventListener("error", event => showError("Failed to connect to RawBT WS API"));
  socket.addEventListener("open", event => socket.send(JSON.stringify(job)));
  socket.addEventListener("message", event => {
    response = JSON.parse(event.data);

    switch (response.responseType) {
    case "progress":
      break;
    case "success":
      socket.close();
      break;
    case "error":
      showError(`RawBT error: ${response.errorMessage}`);
      socket.close();
      break;
    default:
      showError(`Unknown RawBT response: ${event.data}`);
      socket.close();
    }
  });
}

document.getElementById("preview").addEventListener("click", event => {
  printRawbt({
    commands: [makeCommand()],
    printer: "virtual",
  });
});

document.getElementById("print").addEventListener("click", event => {
  printRawbt({
    commands: [makeCommand()],
  });
});

document.addEventListener("DOMContentLoaded", () => {
  FormPersistence.persist(document.getElementById("main-container"));
});
