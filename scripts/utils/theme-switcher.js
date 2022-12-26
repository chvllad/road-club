const initThemeSwitcher = () => {
  const buttons = [...document.querySelectorAll('.theme-switch__button')];

  const setButtonState = (el, setDark) => {
    if (setDark) {
      el.setAttribute('aria-pressed', 'true');
      el.classList.add('theme-switch__button_pressed');
    } else {
      el.setAttribute('aria-pressed', 'false');
      el.classList.remove('theme-switch__button_pressed');
    }
  };

  const handleClick = ({ target }) => {
    const isDark = target.classList.contains('theme-switch__button_pressed');
    setButtonState(target, !isDark);
    if (isDark) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
    window[Symbol.for('updateTheme')]();
  };

  const updateAllButtons = () => {
    const isThemeDark = document.querySelector(':root').getAttribute('data-theme') === 'dark';
    buttons.forEach((el) => {
      setButtonState(el, isThemeDark);
    });
  };

  window.matchMedia('(prefers-color-scheme: dark)').onchange = updateAllButtons;

  updateAllButtons();
  buttons.forEach((el) => {
    el.addEventListener('click', handleClick);
  });
};

export default initThemeSwitcher;
