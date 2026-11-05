document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Ищем главный контейнер статьи на Forestry
    const content = document.querySelector("main") || document.querySelector("article") || document.body;
    if (!content || document.getElementById("tts-btn")) return;

    // Создаем кнопку
    const btn = document.createElement("button");
    btn.id = "tts-btn";
    btn.innerText = "🔊 Read";
    btn.style.cssText = "margin: 20px 0; padding: 10px 16px; cursor: pointer; border-radius: 8px; border: 1px solid #ccc; background: #f5f5f5; color: #000; font-weight: bold; font-size: 16px;";
    
    // Вставляем кнопку в начало статьи
    content.insertBefore(btn, content.firstChild);

    btn.addEventListener("click", () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerText = "🔊 Read";
        return;
      }

      // Фильтруем текст, оставляя только английские слова
      const rawLines = content.innerText.split('\n');
      const englishLines = rawLines.map(line => {
        const words = line.split(/\s+/);
        return words.filter((word, index) => {
          if (/[\u0400-\u04FF\u0590-\u05FF]/.test(word)) return false; // Пропускаем русский и иврит
          if (/[a-zA-Z]/.test(word)) return true; // Оставляем английский
          return words.slice(Math.max(0, index - 2), index + 3).some(w => /[a-zA-Z]/.test(w) && !/[\u0400-\u04FF\u0590-\u05FF]/.test(w));
        }).join(' ');
      });

      const textToSpeak = englishLines
        .join('\n')
        .replace(/[^a-zA-Z0-9.,!?\s]/g, '') 
        .replace(/\s+/g, ' ')
        .trim();

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US'; // Американский голос
      utterance.rate = 0.9;     // Чуть замедленная скорость для учебника
      
      utterance.onend = () => { btn.innerText = "🔊 Read"; };
      btn.innerText = "🛑 Stop";
      window.speechSynthesis.speak(utterance);
    });
  }, 500);
});
