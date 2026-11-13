<style>
.markdown-rendered p, .markdown-rendered ul, .markdown-rendered ol { margin-block-start: 0.5em; margin-block-end: 0.5em; }
.markdown-rendered p + ul, .markdown-rendered p + ol { margin-block-start: 0.25em; }
.markdown-rendered li { margin-bottom: 0.35em; }
.tts-enabled p, .tts-enabled li, .tts-enabled td, .tts-enabled th, .tts-enabled blockquote { cursor: pointer; transition: color 0.15s ease; }
.tts-enabled p:hover, .tts-enabled li:hover, .tts-enabled td:hover { text-decoration: underline dotted rgba(250, 204, 21, 0.45); }
.tts-speaking { color: #facc15 !important; }
</style>
<script>
(function() {
  function initTTS() {
    const content = document.querySelector('.content, main, .markdown-rendered');
    if (content) content.classList.add('tts-enabled');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTTS);
  } else {
    initTTS();
  }
  document.addEventListener('click', function(e) {
    if (e.target.closest('a, button, input, summary, .no-tts')) return;
    const el = e.target.closest('.tts-enabled p, .tts-enabled li, .tts-enabled td, .tts-enabled th, .tts-enabled blockquote');
    if (!el || !('speechSynthesis' in window)) return;
    const selection = window.getSelection().toString().trim();
    const text = selection.length > 0 ? selection : el.innerText.trim();
    if (!text) return;
    const ruCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
    const enCount = (text.match(/[a-zA-Z]/g) || []).length;
    const lang = ruCount > enCount ? 'ru-RU' : 'en-US';
    document.querySelectorAll('.tts-speaking').forEach(node => node.classList.remove('tts-speaking'));
    el.classList.add('tts-speaking');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = lang === 'en-US' ? 0.75 : 0.95;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.filter(x => x.lang === lang && x.localService).pop() || voices.find(x => x.lang && x.lang.startsWith(lang.slice(0, 2)));
    if (v) u.voice = v;
    u.onend = u.onerror = () => el.classList.remove('tts-speaking');
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
})();
</script>
