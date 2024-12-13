const socket = io();

let name = "";

let textarea = document.querySelector("#textarea");

let messageArea = document.querySelector(".message__area");

do {
  name = prompt("Please enter your name : ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  msg = {
    user: name,
    message: message.trim(),
  };

  // Append the message
  appendMessage(msg, "outgoing");

  // Clear the message field
  textarea.value = "";

  //Scroll to the bottom to stay with the messages
  scrollToBottom();

  // Send the message to the server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Receive the messages

socket.on("message", (msg) => {
  //   console.log(msg);
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
