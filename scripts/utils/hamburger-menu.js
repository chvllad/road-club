const initHamburgerMenu = () => {
  const hamburger = document.querySelector('.header__hamburger');
  const menu = document.querySelector('.header__menu');
  const close = document.querySelector('.header__close');
  const links = document.querySelector('.header__nav-list');

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.add('header__menu_visible');
  });

  close.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.remove('header__menu_visible');
  });

  links.addEventListener('click', () => {
    menu.classList.remove('header__menu_visible');
  });
};

export default initHamburgerMenu;
