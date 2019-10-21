import { getBoundedMovement, preventDefault } from '@/utils/dom';

import { ControlType, MAX_CLICK_TRAVEL } from '../constants';
import { getScrollDelta } from './utils';

class MouseControls {
  isPanning = false;

  panDistance = 0;

  scrollComplete = null;

  constructor(handle) {
    this.handle = handle;
  }

  wheel = preventDefault((event) => {
    const delta = getScrollDelta(event);

    this.handle({ type: ControlType.SCALE, delta, event });
  });

  mousemove = (event) => {
    const [deltaX, deltaY] = getBoundedMovement(event);
    this.handle({ type: ControlType.PAN, deltaX, deltaY });

    this.isPanning = true;
    this.panDistance += Math.max(Math.abs(event.movementX), Math.abs(event.movementY));
  };

  mouseup = () => {
    if (this.isPanning) {
      this.isPanning = false;

      if (this.panDistance < MAX_CLICK_TRAVEL) {
        this.handle({ type: ControlType.CLICK });
      } else {
        this.handle({ type: ControlType.END });
      }

      this.panDistance = 0;
    } else {
      this.handle({ type: ControlType.CLICK });
    }

    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
  };

  mousedown = (event) => {
    if (event.button !== 2) {
      event.stopPropagation();

      if (event.shiftKey) {
        this.handle({ type: ControlType.SHIFT_MOUSEDOWN, event });
      } else {
        document.addEventListener('mousemove', this.mousemove);
        document.addEventListener('mouseup', this.mouseup);
      }
    }
  };
}

export default MouseControls;
