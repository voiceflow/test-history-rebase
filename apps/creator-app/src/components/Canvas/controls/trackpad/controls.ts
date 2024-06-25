import { IS_CHROME, IS_CHROME_OS, IS_EDGE, IS_FIREFOX, IS_MAC, IS_WINDOWS, preventDefault } from '@voiceflow/ui';

import { ANIMATION_TIMEOUT, ControlType } from '../../constants';
import MouseControls from '../mouse/controls';
import type { ControlAction, GestureEvent } from '../types';

class TrackPadControls extends MouseControls {
  lastMultiplier = 0;

  lastTimestamp = 0;

  lastDirectionX = 0;

  lastDirectionY = 0;

  animateCompleteEarly: NodeJS.Timeout | null = null;

  lastScale = 1;

  isPanning = false;

  constructor(
    handle: (action: ControlAction) => void,
    private scrollTimeout: number
  ) {
    super(handle);
  }

  dragstart = (event: React.DragEvent) => {
    if (event.defaultPrevented) return;

    event.preventDefault();

    this.isPanning = this.spacebarPressed || event.button === 2;
    if (this.isPanning) {
      this.startPanning();
    } else {
      document.removeEventListener('mousemove', this.mousemove);
      this.isDragging = true;
      this.handle({ type: ControlType.SELECT_DRAG_START, event });
    }
  };

  gesturestart = (event: GestureEvent) => {
    this.lastScale = 1;
    event.preventDefault();
  };

  gesturechange = (event: GestureEvent) => {
    event.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (!('scale' in event) || isNaN(event.scale!)) return;
    const scaleDelta = event.scale! / this.lastScale;
    this.lastScale = event.scale!;
    this.handle({ type: ControlType.SCALE, scale: scaleDelta, event });
  };

  onScrollComplete = () => {
    this.scrollComplete = null;
    this.isPanning = false;
    this.handle({ type: ControlType.END });
  };

  onAnimateCompleteEarly = () => {
    this.animateCompleteEarly = null;
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  wheel = preventDefault((event: WheelEvent & { wheelDeltaX?: number; wheelDeltaY?: number }) => {
    const { deltaMode } = event;
    let { deltaX } = event;
    let { deltaY } = event;

    if (!IS_MAC && event.shiftKey) {
      const temp = deltaY;
      deltaY = deltaX;
      deltaX = temp;
    }

    let wheelDeltaX = 0;
    let wheelDeltaY = 0;

    const isWheelDeltaSupported = event.wheelDeltaY !== undefined;
    if (isWheelDeltaSupported) {
      wheelDeltaX = event.wheelDeltaX!;
      wheelDeltaY = event.wheelDeltaY!;
      if (!IS_MAC && event.shiftKey) {
        const temp = wheelDeltaY;
        wheelDeltaY = wheelDeltaX;
        wheelDeltaX = temp;
      }
    }

    if (IS_WINDOWS && IS_CHROME) {
      const { devicePixelRatio } = window;
      deltaX /= devicePixelRatio;
      deltaY /= devicePixelRatio;
      wheelDeltaX /= devicePixelRatio;
      wheelDeltaY /= devicePixelRatio;
    }

    deltaX = -deltaX;
    deltaY = -deltaY;

    if (IS_CHROME_OS) {
      if (event.ctrlKey && (wheelDeltaY === 120 || wheelDeltaY === -120)) {
        deltaY *= 5;
      }
    } else if (IS_WINDOWS) {
      let lowResMouse = false;
      let lowResCutoff = 120 - 1;

      if (IS_CHROME || IS_EDGE) {
        deltaX = wheelDeltaX;
        deltaY = wheelDeltaY;
        lowResMouse = Math.abs(deltaX) >= lowResCutoff || Math.abs(deltaY) >= lowResCutoff;

        if (lowResMouse) {
          deltaX /= 120;
          deltaY /= 120;
        }
      } else if (IS_FIREFOX) {
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

        if (
          timestamp - this.lastTimestamp < 0.05 &&
          directionX === this.lastDirectionX &&
          directionY === this.lastDirectionY
        ) {
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

    if (this.scrollComplete) {
      clearTimeout(this.scrollComplete);
    }

    this.scrollComplete = setTimeout(this.onScrollComplete, this.scrollTimeout);

    if (this.animateCompleteEarly) {
      clearTimeout(this.animateCompleteEarly);
    }

    this.animateCompleteEarly = setTimeout(this.onAnimateCompleteEarly, ANIMATION_TIMEOUT);

    if (event.ctrlKey) {
      this.handle({ type: ControlType.SCALE, scale: Math.exp(deltaY / 100), event });
      return;
    }

    this.isPanning = true;
    this.handle({ type: ControlType.PAN, deltaX, deltaY });
  });
}

export default TrackPadControls;
