const socket = io();

let name = "";
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let sendButton = document.querySelector(".send-button");

// Store user avatars to keep them consistent
const userAvatars = new Map();

do {
    name = prompt("Please enter your name : ");
} while (!name);

// Generate a random but consistent avatar URL for each user
function getAvatarUrl(username) {
    if (!userAvatars.has(username)) {
        // Generate a random seed for consistent images per user
        const seed = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        userAvatars.set(username, `https://picsum.photos/seed/${seed}/50/50`);
    }
    return userAvatars.get(username);
}

textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(e.target.value);
    }
});

sendButton.addEventListener("click", () => {
    sendMessage(textarea.value);
});

function sendMessage(message) {
    if (!message.trim()) return;
    
    let msg = {
        user: name,
        message: message.trim(),
        avatar: getAvatarUrl(name)
    };

    appendMessage(msg, "outgoing");
    textarea.value = "";
    scrollToBottom();

    socket.emit("message", msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markup = `
        <div class="avatar">
            <img src="${msg.avatar}" alt="${msg.user}'s avatar" />
        </div>
        <div class="content">
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        </div>
    `;

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}