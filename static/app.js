const source = document.querySelector('#source');
const translateButton = document.querySelector('#translate');
const result = document.querySelector('#result');
const copyButton = document.querySelector('#copy');
const message = document.querySelector('#message');
let translatedText = '';

source.addEventListener('input', () => {
  document.querySelector('#count').textContent = `${source.value.length.toLocaleString()} / 5,000`;
  message.textContent = '';
});

document.querySelector('#clear').addEventListener('click', () => {
  source.value = '';
  source.dispatchEvent(new Event('input'));
  source.focus();
});

document.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => {
  source.value = chip.dataset.prompt;
  source.dispatchEvent(new Event('input'));
  source.focus();
}));

translateButton.addEventListener('click', async () => {
  const text = source.value.trim();
  if (!text) {
    message.textContent = '先寫下你的音樂想像，再開始翻譯吧。';
    source.focus();
    return;
  }
  translateButton.disabled = true;
  translateButton.innerHTML = '<span class="spinner"></span> 正在翻譯…';
  message.textContent = '';
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '翻譯失敗，請稍後再試。');
    translatedText = data.translation;
    result.textContent = translatedText;
    result.classList.add('has-result');
    copyButton.disabled = false;
    document.querySelector('#resultMeta').textContent = `${translatedText.length.toLocaleString()} CHARACTERS · READY TO USE`;
    message.textContent = '翻譯完成，可以複製並貼到 Suno AI。';
  } catch (error) {
    message.textContent = error.message || '連線發生問題，請稍後重試。';
  } finally {
    translateButton.disabled = false;
    translateButton.innerHTML = '<span class="button-sparkle">✦</span> 再次翻譯 <span class="button-arrow">→</span>';
  }
});

copyButton.addEventListener('click', async () => {
  if (!translatedText) return;
  try {
    await navigator.clipboard.writeText(translatedText);
    copyButton.innerHTML = '<span>✓</span> 已複製';
    setTimeout(() => { copyButton.innerHTML = '<span>▢</span> 複製提示詞'; }, 1600);
  } catch {
    message.textContent = '無法存取剪貼簿，請手動選取並複製文字。';
  }
});
