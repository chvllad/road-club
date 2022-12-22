class TypesScroller {
  constructor(block) {
    const parent = block.querySelector('.types__list');
    const els = [...parent.querySelectorAll('.types__item')];
    if (els.length < 2) {
      return;
    }

    let clones = els.slice(0, 3);
    if (clones.length === 2) {
      clones.push(clones[0]);
    }
    clones = clones.map((el) => {
      const rv = el.cloneNode(true);
      rv.classList.remove('types__item_visible');
      rv.setAttribute('aria-hidden', 'true');
      return rv;
    });

    parent.append(...clones);

    this.parent = parent;
    this.els = els;
    this.clones = clones;

    this.elWidth = 0;
    this.currentEl = 0;
    this.forceScroll = 0;
    this.scrollTo = null;
    this.swipeMode = false;

    const prevButton = block.querySelector('.types__prev');
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollBtn(false);
    });
    const nextButton = block.querySelector('.types__next');
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollBtn(true);
    });

    parent.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    parent.addEventListener('touchstart', () => {
      this.swipeMode = true;
    }, { passive: true });
    parent.addEventListener('touchend', () => {
      this.swipeMode = false;
      this.waitScrollToEl();
    }, { passive: true });
    window.addEventListener('resize', () => this.handleResize(), { passive: true });

    this.handleResize();
    this.changeItems(0);
  }

  handleResize() {
    this.elWidth = this.els[0].getBoundingClientRect().width;

    this.parent.scroll(this.currentEl * this.elWidth + 1, 0);
  }

  changeItems(leftPos) {
    if (this.currentEl === 0) {
      this.parent.scroll(this.elWidth * this.els.length + leftPos, 0);
    } else if (this.currentEl > this.els.length) {
      this.parent.scroll(leftPos - (this.elWidth * (this.currentEl - 1)), 0);
    }
  }

  changeClasses(lastEl) {
    const fixedLastEl = lastEl % this.els.length;
    this.els[fixedLastEl].classList.remove('types__item_visible');
    if (fixedLastEl < 3) {
      this.clones[fixedLastEl].classList.remove('types__item_visible');
    }
    const fixedCurrentEl = this.currentEl % this.els.length;
    this.els[fixedCurrentEl].classList.add('types__item_visible');
    if (fixedCurrentEl < 3) {
      this.clones[fixedCurrentEl].classList.add('types__item_visible');
    }
  }

  handleScroll() {
    const leftPos = this.parent.scrollLeft;
    const lastEl = this.currentEl;
    if (this.forceScroll > 0) {
      this.waitScrollToEl();
      return;
    }
    const elRaw = leftPos / this.elWidth;
    const elRawInt = Math.floor(elRaw);
    // Round with hysteresis equals to 10% of element width
    if (elRaw - elRawInt < 0.45) {
      this.currentEl = elRawInt;
    } else if (elRaw - elRawInt > 0.55) {
      this.currentEl = elRawInt + 1;
    }
    if (lastEl !== this.currentEl) {
      this.changeClasses(lastEl);
      this.changeItems(leftPos);
    }
    if (!this.swipeMode) {
      this.waitScrollToEl();
    }
  }

  waitScrollToEl() {
    clearTimeout(this.scrollTo);
    if (!this.swipeMode) {
      this.scrollTo = setTimeout(() => this.scrollToEl(), 200);
    }
  }

  scrollToEl() {
    if (this.forceScroll > 1) {
      this.forceScroll -= 1;
      return;
    }
    this.scrollTo = null;
    const left = this.elWidth * this.currentEl + 1;
    if (Math.round(left) === Math.round(this.parent.scrollLeft)) {
      this.forceScroll = 0;
      return;
    }
    this.isScrollingToEl = true;
    this.parent.scroll({
      left,
      behavior: 'smooth',
    });
  }

  scrollBtn(isNext) {
    const lastEl = this.currentEl;
    this.forceScroll += 1;
    if (isNext) {
      if (this.currentEl === this.els.length) {
        this.currentEl = 1;
        this.parent.scroll(1, 0);
      } else {
        this.currentEl += 1;
        this.parent.scroll(this.elWidth * lastEl + 1, 0);
      }
    } else if (this.currentEl === 0) {
      this.currentEl = this.els.length - 1;
      this.parent.scroll(this.elWidth * this.els.length + 1, 0);
    } else {
      this.currentEl -= 1;
      this.parent.scroll(this.elWidth * lastEl + 1, 0);
    }
    this.changeClasses(lastEl);
    this.scrollToEl();
  }
}

export default TypesScroller;
