/**
 * @fileOverview Implementation of carousel helper
 * @author Vladislav Cherepita
 * @version 1.0.0
 */

/** Carousel helper */
export default class Carousel {
  /**
   * Create a carousel helper.
   * @param {HTMLElement} carouselEl - The carousel element.
   * @param {object} config - Carousel configuration.
   * @param {number} config.timeInterval - Time in ms between automatic slides rotations.
   * @param {bool} config.alwaysSlide - Change default fade animation into sliding one.
   * @param {bool} config.ignoreEvents - Change how touch and keyboard events are handled.
   * @param {number} config.touchMinDistance - Min distance in pixels of a swipe
   * to register it as a slide change.
   * @param {number} config.touchDebounce - Min time in ms between touch events to
   * register them as a slide change
   */
  constructor(
    carouselEl,
    {
      timeInterval = 10000,
      alwaysSlide = false,
      ignoreEvents = false,
      touchMinDistance = 50,
      touchDebounce = 250,
    } = {},
  ) {
    /** @private */
    this.isPlayingEnabled = false;
    /**
     * Time in ms between automatic slides rotations.
     * New value takes effect at the next rotation.
     * @type {number}
     */
    this.timeInterval = timeInterval;
    /** @private */
    this.currentIdx = 0;
    /** @private */
    this.slideTimeout = null;
    /** @private */
    this.paused = false;
    /** @private */
    this.touchMinDistance = touchMinDistance;
    /** @private */
    this.touchDebounce = touchDebounce;
    /**
     * Changes default fade animation into sliding.
     * @type {boolean}
     */
    this.alwaysSlide = alwaysSlide;
    /**
     * Ignores touch and keyboard events.
     * @type {boolean}
     */
    this.ignoreEvents = ignoreEvents;

    /** @private */
    this.itemEls = [...carouselEl.querySelectorAll('.bikes__link')];
    /** @private */
    this.dotEls = [...carouselEl.querySelectorAll('.bikes__dot')];
    /** @private */
    this.carouselEl = carouselEl;
    /** @private */
    this.itemWrapEl = carouselEl.querySelector('.bikes__list');
    /** @private */
    this.dotsWrapEl = carouselEl.querySelector('.bikes__dots');

    this.initElementsEvents();
    this.initKeyboardMouseEvents();
    this.initTouchEvents();
  }

  /** @private */
  initElementsEvents() {
    this.itemWrapEl.addEventListener('focusin', () => this.handlePause(), { passive: true });
    this.itemWrapEl.addEventListener('focusout', () => this.handleResume(), { passive: true });
    this.itemWrapEl.addEventListener('animationend', ({ target }) => {
      Carousel.removeAnimationClasses(target);
    }, { passive: true });

    this.dotsWrapEl.addEventListener('click', (e) => this.handleDotClick(e));
  }

  /** @private */
  initKeyboardMouseEvents() {
    this.carouselEl.addEventListener('mouseover', () => this.handlePause(), { passive: true });
    this.carouselEl.addEventListener('mouseout', () => this.handleResume(), { passive: true });
  }

  /** @private */
  initTouchEvents() {
    let touchStartX = 0;
    let slideFinished = false;
    let lastTouchEnded = performance.now();

    this.itemWrapEl.addEventListener('touchstart', (e) => {
      if (this.ignoreEvents) {
        return;
      }
      this.paused = true;
      slideFinished = false;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.itemWrapEl.addEventListener('touchend', () => {
      if (this.ignoreEvents) {
        return;
      }
      if (slideFinished) {
        lastTouchEnded = performance.now();
      }
      this.paused = false;
    }, { passive: true });

    this.itemWrapEl.addEventListener('touchmove', (e) => {
      if (this.ignoreEvents
        || slideFinished
        || (performance.now() - lastTouchEnded) < this.touchDebounce) {
        return;
      }
      const touchPosition = e.changedTouches[0].screenX;
      if (Math.abs(touchPosition - touchStartX) > this.touchMinDistance) {
        if (touchPosition < touchStartX) {
          this.showNextSlider(true);
        } else {
          this.showPrevSlider(true);
        }
        slideFinished = true;
      }
    }, { passive: true });
  }

  /**
   * Switch slide to the index of the clicked dot.
   * @private
   */
  handleDotClick(e) {
    const { target } = e;
    const idx = this.dotEls.indexOf(target.closest('.bikes__dot'));
    if (idx === -1) {
      return;
    }
    e.preventDefault();
    let movement = 0;
    if (this.alwaysSlide) {
      movement = 1;
      if (idx < this.currentIdx) {
        movement = -movement;
      }
    }
    this.showSliderAt(idx, movement);
  }

  /**
   * Pause automatic slides rotation.
   * @private
   */
  handlePause() {
    this.paused = true;
  }

  /**
   * Resume automatic slides rotation.
   * @private
   */
  handleResume() {
    this.paused = false;
  }

  /**
   * Remove all animation classes from element.
   * @private
   * @param {HTMLElement} el - Element for classes to remove.
   */
  static removeAnimationClasses(el) {
    el.classList.remove(
      'bikes__link_animation_hide',
      'bikes__link_animation_slide-left',
      'bikes__link_animation_slide-right',
    );
  }

  /**
   * Show slider at specified index and switch dots.
   * @private
   * @param {number} idx - Index of slider to show.
   * @param {number} slideMovement - Chooses slide animation.
   *   0 - no animation, 1 - left slide, -1 = right slide.
   */
  showSliderAt(setIdx, slideMovement) {
    if (this.currentIdx === setIdx) {
      return;
    }
    const lastIdx = this.currentIdx;
    this.currentIdx = setIdx;

    this.itemEls.forEach((item, idx) => {
      Carousel.removeAnimationClasses(item);
      if (idx === setIdx) {
        item.classList.add('bikes__link_active');
      } else {
        item.classList.remove('bikes__link_active');
      }
    });

    this.dotEls[lastIdx].classList.remove('bikes__dot_active');
    this.dotEls[setIdx].classList.add('bikes__dot_active');

    let className;
    if (slideMovement === 0) {
      className = 'bikes__link_animation_hide';
    } else if (slideMovement > 0) {
      className = 'bikes__link_animation_slide-left';
    } else {
      className = 'bikes__link_animation_slide-right';
    }
    const lastItem = this.itemEls[lastIdx];
    lastItem.classList.add(className);

    if (this.isPlayingEnabled) {
      this.restartTimer();
    }
  }

  /**
   * Restart timer of sliders rotation.
   * @private
   */
  restartTimer() {
    clearTimeout(this.slideTimeout);
    this.slideTimeout = setTimeout(() => this.rotateSlide(), this.timeInterval);
  }

  /**
   * Show next slider and start a new timer if carousel is enabled.
   * @private
   */
  rotateSlide() {
    if (!this.isPlayingEnabled) {
      this.slideTimeout = null;
      return;
    }
    if (!this.paused) {
      this.showNextSlider();
    } else {
      this.restartTimer();
    }
  }

  /**
   * Show previous slider.
   * @param {boolean} doSliding - Perform sliding of previously active slide.
   */
  showPrevSlider(doSliding = this.alwaysSlide) {
    let nextIdx = this.currentIdx - 1;
    if (nextIdx < 0) {
      nextIdx = this.itemEls.length - 1;
    }
    this.showSliderAt(nextIdx, doSliding ? -1 : 0);
  }

  /**
   * Show next slider.
   * @param {boolean} doSliding - Perform sliding of previously active slide.
   */
  showNextSlider(doSliding = this.alwaysSlide) {
    let nextIdx = this.currentIdx + 1;
    if (nextIdx >= this.itemEls.length) {
      nextIdx = 0;
    }
    this.showSliderAt(nextIdx, doSliding ? 1 : 0);
  }

  /**
   * Resets current slide index without any slides changing.
   */
  reset() {
    const active = this.itemWrapEl.querySelector('.bikes__link_active');
    const idx = this.itemEls.indexOf(active);
    this.currentIdx = idx;

    const currentDot = this.dotsWrapEl.querySelector('.bikes__dot_active');
    if (currentDot) {
      currentDot.classList.remove('bikes__dot_active');
    }
    this.dotEls[idx].classList.add('bikes__dot_active');
  }

  /**
   * Start automatic sliders rotation.
   */
  start() {
    // A prefers-reduced-motion user setting must always override autoplay
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (hasReducedMotion.matches) {
      this.isPlayingEnabled = false;
      return;
    }

    this.isPlayingEnabled = true;
    this.restartTimer();
  }

  /**
   * Stop automatic sliders rotation.
   */
  stop() {
    this.isPlayingEnabled = false;
    this.itemEls.forEach((item) => {
      Carousel.removeAnimationClasses(item);
    });
  }
}
