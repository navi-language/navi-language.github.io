const SERVER_URL = 'https://play.navi-lang.org';
const INLINE_RUN = true;

const registerPlayButton = () => {
  const codeBlocks = document.querySelectorAll('[class*=language-nv]');

  codeBlocks.forEach((container) => {
    if (container.querySelector('button.play')) return;

    const code = container.querySelector('code');
    if (!code) return;

    let source = code.textContent || '';
    if (!source) return;

    const playBtn = document.createElement('button');
    playBtn.innerHTML = 'Run';
    playBtn.classList.add('play');
    playBtn.addEventListener('click', () => {
      let source = code.textContent || '';
      if (!source) return;

      if (INLINE_RUN) {
        runCode(container, playBtn, source);
      } else {
        const url =
          'https://navi-lang.org/play?source=' +
          base64Encode(code.textContent || '');
        window.open(url, '_blank');
      }
    });
    container.prepend(playBtn);
  });
};

const runCode = (container: Element, playBtn: Element, code: string) => {
  playBtn.setAttribute('disabled', 'true');

  const apiPath = '/execute';
  const loadingMessage = 'Executing, please wait...';

  renderOutput(container, loadingMessage, 'loading');

  fetch(SERVER_URL + apiPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ source: code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        renderOutput(container, data.error, 'error');
      } else if (!data.out) {
        renderOutput(container, 'No output.', 'success');
      } else {
        renderOutput(container, data.out, 'success');
      }
    })
    .finally(() => {
      playBtn.removeAttribute('disabled');
    });
};

const renderOutput = (
  container: Element,
  output: string,
  status: 'loading' | 'success' | 'error'
) => {
  document.querySelectorAll('pre.run-output').forEach((el) => el.remove());
  let el = container.querySelector('pre.run-output');
  el = document.createElement('pre');
  el.classList.add('run-output');
  container.after(el);
  el.setAttribute('status', status);

  // WARNING: Ensure to use `textContent` to set output, to prevent XSS attacks.
  el.textContent = output;
};

const base64Encode = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)));
};

if (!import.meta.env.SSR) {
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(registerPlayButton);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', registerPlayButton);
}
