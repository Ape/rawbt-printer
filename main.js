function showError(message) {
  const element = document.getElementById("errorAlert");

  console.error(message);
  element.textContent = message;
  element.classList.remove("d-none");
  element.classList.add("show");
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

function printRawbt(commands){
  const socket = new WebSocket("ws://localhost:40213/");

  socket.addEventListener("error", event => showError("Failed to connect to RawBT WS API"));
  socket.addEventListener("open", event => socket.send(JSON.stringify({commands: commands})));
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

document.getElementById("print").addEventListener("click", event => {
  printRawbt([makeCommand()]);
});
