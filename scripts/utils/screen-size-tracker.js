/**
 * @fileOverview Implementation of sreen size tracker
 * @author Vladislav Cherepita
 * @version 1.0.0
 */

/**
 * Callback for ScreenSizeTracker event handlers.
 *
 * @callback ScreenSizeTrackerCallback
 * @param {bool} isBigger - Is screen size become bigger
 * than size specified for this function.
 */

/** Sreen size tracker */
class ScreenSizeTracker {
  constructor() {
    /** @private */
    this.sizes = [];
    /** @private */
    this.cbs = [];
    /** @private */
    this.prevBigger = [];
    /** @private */
    this.eventInited = false;
    /** @private */
    this.lastCheckedSize = 0;
  }

  /**
   * An event handler for window resize event
   * @private
   * */
  handleEvent() {
    const newSize = window.innerWidth;
    const minSize = Math.min(this.lastCheckedSize, newSize);
    const maxSize = Math.max(this.lastCheckedSize, newSize);
    this.sizes.forEach((size, idx) => {
      if (size >= minSize && size <= maxSize) {
        const isBigger = newSize > size;
        if (isBigger !== this.prevBigger[idx]) {
          this.cbs[idx].forEach((cb) => {
            cb(isBigger);
          });
          this.prevBigger[idx] = isBigger;
        }
      }
    });
    this.lastCheckedSize = newSize;
  }

  /**
   *
   * @param {number} size Size of the window to track
   * @param {ScreenSizeTrackerCallback} cb Fucntion to call when
   * window size crosses become bigger or smaller than size
   * @param {bool} callNow Do the first call immideatly
   */
  addListener(size, cb, callNow = true) {
    const isBigger = window.innerWidth > size;
    const idx = this.sizes.indexOf(size);
    if (idx !== -1) {
      this.cbs[idx].push(cb);
    } else {
      this.sizes.push(size);
      this.cbs.push([cb]);
      this.prevBigger.push(isBigger);
    }
    if (!this.eventInited) {
      this.eventInited = true;
      this.lastCheckedSize = window.innerWidth;
      window.addEventListener('resize', this, { passive: true });
    }
    if (callNow) {
      cb(isBigger);
    }
  }
}

export default new ScreenSizeTracker();
