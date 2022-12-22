import TypesScroller from './utils/types-scroller.js';
import Carousel from './utils/carousel.js';
import initThemeSwitcher from './utils/theme-switcher.js';
import initHamburgerMenu from './utils/hamburger-menu.js';
import initFeedbackForm from './utils/feedback-form.js';
import initBikesMenu from './utils/bikes-menu.js';
import ScreenSizeTracker from './utils/screen-size-tracker.js';

// eslint-disable-next-line no-unused-vars
const types = new TypesScroller(document.querySelector('.types'));

const carousel = new Carousel(document.querySelector('.bikes__carousel'));

ScreenSizeTracker.addListener(576, (isBigger) => {
  if (isBigger) {
    carousel.stop();
    carousel.ignoreEvents = true;
  } else {
    carousel.start();
    carousel.ignoreEvents = false;
  }
});

carousel.start();

initThemeSwitcher();
initHamburgerMenu();
initFeedbackForm();
initBikesMenu();
