document.addEventListener("DOMContentLoaded", function () {
  
  document.querySelectorAll(".sidebar-section").forEach((section) => {
    section.addEventListener("click", () => {
      alert(`Loading data for: ${section.querySelector(".title").innerText}`);
    });
  });

  
  const input = document.getElementById("capability-input");
  const formSendBtn = document.getElementById("sendBtn");
  const outputBox = document.getElementById("ai-output");

  input.addEventListener("input", () => {
    const value = input.value.trim();
    formSendBtn.disabled = !value;
    formSendBtn.style.opacity = value ? 1 : 0.5;
  });

  formSendBtn.addEventListener("click", () => {
    const userMessage = input.value.trim();
    if (userMessage) {
      outputBox.textContent = "⏳ Thinking...";
      getBotResponse(userMessage, "ai-output");
      input.value = "";
    }
  });

  
  const chatbotContainer = document.getElementById("chatbot-container");
  const clostBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  if (chatbotIcon && chatbotContainer) {
    chatbotIcon.addEventListener("click", () => {
      chatbotContainer.classList.remove("hidden");
      chatbotIcon.style.display = "none";
    });

    clostBtn.addEventListener("click", () => {
      chatbotContainer.classList.add("hidden");
      chatbotIcon.style.display = "flex";
    });

    sendBtn.addEventListener("click", () => {
      sendMessage("chatbot-input", "chatbot-messages");
    });

    chatBotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage("chatbot-input", "chatbot-messages");
    });
  }
});


function sendMessage(inputId, messageContainerId) {
  const chatInput = document.getElementById(inputId);
  const userMessage = chatInput.value.trim();

  if (userMessage) {
    appendMessage("user", userMessage, messageContainerId);
    chatInput.value = "";
    getBotResponse(userMessage, messageContainerId);
  }
}


function appendMessage(sender, message, messageContainerId) {
  const messageContainer = document.getElementById(messageContainerId);


  if (messageContainerId === "ai-output") {
    messageContainer.textContent = message;
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}


async function getBotResponse(userMessage, messageContainerId) {
  const API_KEY = "AIzaSyAC4Mn0k1YDwELbCNXIMtjjUQFewPeBLCk";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;



  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (!data.candidates || !data.candidates.length) {
      throw new Error("No response from Gemini API");
    }

    const botMessage = data.candidates[0].content.parts[0].text;
    appendMessage("bot", botMessage, messageContainerId);
  } catch (error) {
    console.error("Gemini API Error:", error);
    appendMessage(
      "bot",
      "❌ Sorry, I'm having trouble responding. Please try again later.",
      messageContainerId
    );
  }
}
