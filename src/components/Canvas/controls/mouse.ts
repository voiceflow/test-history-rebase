import { preventDefault } from '@/utils/dom';
import MouseMovement from '@/utils/mouseMovement';

import { ControlType } from '../constants';
import { BaseControls, getScrollDelta } from './utils';

class MouseControls extends BaseControls {
  isPanning = false;

  isDragging = false;

  ignoreNextClick = false;

  scrollComplete = null;

  mouseMovement = new MouseMovement();

  wheel = preventDefault((event: WheelEvent) => {
    const delta = getScrollDelta(event);

    this.handle({ type: ControlType.SCALE, delta, event });
  });

  mousemove = (event: MouseEvent) => {
    this.mouseMovement.track(event);

    const [deltaX, deltaY] = this.mouseMovement.getBoundedMovement();

    this.handle({ type: ControlType.PAN, deltaX, deltaY });
  };

  dragstart = (event: React.DragEvent) => {
    if (event.defaultPrevented) return;

    if (event.shiftKey) {
      this.isDragging = true;

      this.handle({ type: ControlType.SHIFT_DRAG_START, event });
    } else {
      this.isPanning = true;

      document.addEventListener('mousemove', this.mousemove);
    }

    document.addEventListener('mouseup', this.mouseup, { once: true });
  };

  mouseup = () => {
    this.mouseMovement.clear();

    if (this.isPanning) {
      this.isPanning = false;

      this.handle({ type: ControlType.END });
    } else if (this.isDragging) {
      this.isDragging = false;
      this.ignoreNextClick = true;

      this.handle({ type: ControlType.END });
    }

    document.removeEventListener('mousemove', this.mousemove);
  };

  click = (event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    if (this.ignoreNextClick) {
      this.ignoreNextClick = true;

      return;
    }

    if (event.button !== 2) {
      event.stopPropagation();

      this.handle({ type: ControlType.CLICK, event });
    }
  };
}

export default MouseControls;
