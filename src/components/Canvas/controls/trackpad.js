import { isChrome, isChromeOS, isEdge, isFirefox, isMac, isWindows } from '@/config';
import { preventDefault } from '@/utils/dom';

import { ControlType, SCROLL_TIMEOUT } from '../constants';

class TrackPadControls {
  lastMultiplier = 0;

  lastTimestamp = 0;

  lastDirectionX = 0;

  lastDirectionY = 0;

  scrollComplete = null;

  lastScale = 1;

  isPanning = false;

  constructor(handle) {
    this.handle = handle;
  }

  gesturestart = (event) => {
    this.lastScale = 1;
    event.preventDefault();
  };

  gesturechange = (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (!('scale' in event) || isNaN(event.scale)) return;
    const scaleDelta = event.scale / this.lastScale;
    this.lastScale = event.scale;
    this.handle({ type: ControlType.SCALE, scale: scaleDelta, event });
  };

  onScrollComplete = () => {
    this.scrollComplete = null;
    this.isPanning = false;
    this.handle({ type: ControlType.END });
  };

  wheel = preventDefault((event) => {
    const deltaMode = event.deltaMode;
    let deltaX = event.deltaX;
    let deltaY = event.deltaY;
    if (!isMac && event.shiftKey) {
      const temp = deltaY;
      deltaY = deltaX;
      deltaX = temp;
    }
    let wheelDeltaX = 0;
    let wheelDeltaY = 0;
    const isWheelDeltaSupported = event.wheelDeltaY !== undefined;
    if (isWheelDeltaSupported) {
      wheelDeltaX = event.wheelDeltaX;
      wheelDeltaY = event.wheelDeltaY;
      if (!isMac && event.shiftKey) {
        const temp = wheelDeltaY;
        wheelDeltaY = wheelDeltaX;
        wheelDeltaX = temp;
      }
    }
    if (isWindows && isChrome) {
      const devicePixelRatio = window.devicePixelRatio;
      deltaX /= devicePixelRatio;
      deltaY /= devicePixelRatio;
      wheelDeltaX /= devicePixelRatio;
      wheelDeltaY /= devicePixelRatio;
    }
    deltaX = -deltaX;
    deltaY = -deltaY;

    if (isChromeOS) {
      if (event.ctrlKey && (wheelDeltaY === 120 || wheelDeltaY === -120)) {
        deltaY *= 5;
      }
    } else if (isWindows) {
      let lowResMouse = false;
      let lowResCutoff = 120 - 1;
      if (isChrome || isEdge) {
        deltaX = wheelDeltaX;
        deltaY = wheelDeltaY;
        lowResMouse = Math.abs(deltaX) >= lowResCutoff || Math.abs(deltaY) >= lowResCutoff;
        if (lowResMouse) {
          deltaX /= 120;
          deltaY /= 120;
        }
      } else if (isFirefox) {
        if (deltaMode) {
          deltaX *= 40;
          deltaY *= 40;
        }
        lowResCutoff = 100 - 1;
        lowResMouse = Math.abs(deltaX) >= lowResCutoff || Math.abs(deltaY) >= lowResCutoff;
        if (lowResMouse) {
          deltaX /= 120;
          deltaY /= 120;
        } else {
          const numLinesToScroll = 1;
          deltaX /= numLinesToScroll;
          deltaY /= numLinesToScroll;
        }
      }
      if (lowResMouse) {
        const timestamp = event.timeStamp / 1e3;
        const directionX = Math.sign(deltaX);
        const directionY = Math.sign(deltaY);
        let multiplier = 8;
        if (timestamp - this.lastTimestamp < 0.05 && directionX === this.lastDirectionX && directionY === this.lastDirectionY) {
          multiplier = this.lastMultiplier * 2.5;
        }
        deltaX *= multiplier;
        deltaY *= multiplier;
        const max = event.ctrlKey ? 40 : 120;
        const lengthSquared = deltaX * deltaX + deltaY * deltaY;
        if (lengthSquared > max * max) {
          deltaX *= max / Math.sqrt(lengthSquared);
          deltaY *= max / Math.sqrt(lengthSquared);
        }
        this.lastMultiplier = multiplier;
        this.lastTimestamp = timestamp;
        this.lastDirectionX = directionX;
        this.lastDirectionY = directionY;
      }
    }

    if (this.scrollComplete) clearTimeout(this.scrollComplete);
    this.scrollComplete = setTimeout(this.onScrollComplete, SCROLL_TIMEOUT);

    if (event.ctrlKey) {
      this.handle({ type: ControlType.SCALE, scale: Math.exp(deltaY / 100), event });
      return;
    }

    this.isPanning = true;
    this.handle({ type: ControlType.PAN, deltaX, deltaY });
  });
}

export default TrackPadControls;
