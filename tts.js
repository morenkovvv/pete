document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const content = document.querySelector(".markdown-preview-view") || document.querySelector("main") || document.body;
    if (!content || document.getElementById("tts-btn")) return;

    const btn = document.createElement("button");
    btn.id = "tts-btn";
    btn.innerText = "🔊 Озвучить текст";
    btn.style.cssText = "margin: 15px 0; padding: 8px 14px; cursor: pointer; border-radius: 6px; border: 1px solid #ccc; background: #eee; color: #000; font-weight: bold;";
    content.insertBefore(btn, content.firstChild);

    btn.addEventListener("click", () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerText = "🔊 Озвучить текст";
        return;
      }
      const text = content.innerText.replace("🔊 Озвучить текст", ""); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; 
      utterance.onend = () => { btn.innerText = "🔊 Озвучить текст"; };
      btn.innerText = "🛑 Остановить";
      window.speechSynthesis.speak(utterance);
    });
  }, 500);
});
