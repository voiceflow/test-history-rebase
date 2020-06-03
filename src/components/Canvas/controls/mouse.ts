import { preventDefault } from '@/utils/dom';
import MouseMovement from '@/utils/mouseMovement';

import { ControlType, MAX_CLICK_TRAVEL } from '../constants';
import { BaseControls, getScrollDelta } from './utils';

class MouseControls extends BaseControls {
  isPanning = false;

  panDistance = 0;

  scrollComplete = null;

  mouseMovement = new MouseMovement();

  wheel = preventDefault((event: WheelEvent) => {
    const delta = getScrollDelta(event);

    this.handle({ type: ControlType.SCALE, delta, event });
  });

  mousemove = (event: MouseEvent) => {
    this.mouseMovement.track(event);

    const [deltaX, deltaY] = this.mouseMovement.getBoundedMovement();
    const [movementX, movementY] = this.mouseMovement.getMovement();

    this.handle({ type: ControlType.PAN, deltaX, deltaY });

    this.isPanning = true;
    this.panDistance += Math.max(Math.abs(movementX), Math.abs(movementY));
  };

  mouseup = (event: MouseEvent) => {
    this.mouseMovement.clear();

    if (this.isPanning) {
      this.isPanning = false;

      if (this.panDistance < MAX_CLICK_TRAVEL) {
        this.handle({ type: ControlType.CLICK, event });
      } else {
        this.handle({ type: ControlType.END });
      }

      this.panDistance = 0;
    } else {
      this.handle({ type: ControlType.CLICK, event });
    }

    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
  };

  mousedown = (event: React.MouseEvent) => {
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
