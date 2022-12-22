const initFeedbackForm = () => {
  const form = document.querySelector('.footer__form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    form.classList.add('footer__form_visible-message');
    setTimeout(() => form.classList.remove('footer__form_visible-message'), 2000);
    document.activeElement.blur();
  });
};

export default initFeedbackForm;
