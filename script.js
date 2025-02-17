import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const saveButton = document.getElementById("save-api-key");
const statusMessage = document.getElementById("api-key-status");
const apiKeyInput = document.getElementById("api-key-input");

document.getElementById("tryNow").addEventListener("click", function () {
  document.getElementById("summarizer").scrollIntoView({ behavior: "smooth" });
});

saveButton.addEventListener("click", function () {
  const apiKey = apiKeyInput.value.trim();

  if (apiKey) {
    localStorage.setItem("gemini_api_key", apiKey);

    statusMessage.textContent = "API Key Saved Successfully!";
    statusMessage.style.color = "#27ae60";
    apiKeyInput.value = "";
  } else {
    statusMessage.textContent = "Please enter a valid API key!";
    statusMessage.style.color = "#e74c3c";
  }
});

document.querySelectorAll(".summary-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    const text = document.getElementById("textInput").value.trim();

    if (!text) {
      alert("Please enter some text to summarize.");
      return;
    }

    const length = this.getAttribute("data-length");

    const summary = await getGeminiSummary(text, length);

    const outputDiv = document.getElementById("summaryOutput");

    outputDiv.innerText = summary || "Failed to fetch summary.";

    outputDiv.style.display = "block";

    outputDiv.scrollIntoView({ behavior: "smooth" });
  });
});

async function getGeminiSummary(text, level) {
  const promptMap = {
    short: "Provide a short summary of this text:",
    medium: "Provide a balanced summary of this text:",
    detailed: "Provide a detailed summary of this text:",
  };

  const storedApiKey = localStorage.getItem("gemini_api_key");

  const genAI = new GoogleGenerativeAI(storedApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `${promptMap[level]}\n${text}`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
