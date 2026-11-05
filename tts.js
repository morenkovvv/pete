document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const content = document.querySelector(".markdown-preview-view") || document.querySelector("main") || document.body;
    if (!content || document.getElementById("tts-btn")) return;

    const btn = document.createElement("button");
    btn.id = "tts-btn";
    btn.innerText = "🔊 Читать";
    btn.style.cssText = "margin: 15px 0; padding: 8px 14px; cursor: pointer; border-radius: 6px; border: 1px solid #ccc; background: #eee; color: #000; font-weight: bold;";
    content.insertBefore(btn, content.firstChild);

    btn.addEventListener("click", () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerText = "🔊 Читать";
        return;
      }

      // Фильтруем текст: разбиваем на строки и убираем всё, кроме английского
      const rawLines = content.innerText.split('\n');
      const englishLines = rawLines.map(line => {
        const words = line.split(/\s+/);
        return words.filter((word, index) => {
          // Если в слове есть русские буквы или иврит — полностью игнорируем его
          if (/[\u0400-\u04FF\u0590-\u05FF]/.test(word)) return false;
          // Если есть английские буквы — оставляем
          if (/[a-zA-Z]/.test(word)) return true;
          // Оставляем цифры и знаки, только если рядом есть английские слова
          return words.slice(Math.max(0, index - 2), index + 3).some(w => /[a-zA-Z]/.test(w) && !/[\u0400-\u04FF\u0590-\u05FF]/.test(w));
        }).join(' ');
      });

      // Очищаем финальный текст от лишнего мусора и пустых строк
      const textToSpeak = englishLines
        .join('\n')
        .replace(/[^a-zA-Z0-9.,!?\s]/g, '') 
        .replace(/\s+/g, ' ')
        .trim();

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US'; // Включаем чистый американский голос
      
      utterance.onend = () => { btn.innerText = "🔊 Читать"; };
      btn.innerText = "🛑 Stop";
      window.speechSynthesis.speak(utterance);
    });
  }, 500);
});
