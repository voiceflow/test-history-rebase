import { preventDefault } from '@/utils/dom';
import MouseMovement from '@/utils/mouseMovement';

import { ControlType } from '../constants';
import { BaseControls, getScrollDelta } from './utils';

class MouseControls extends BaseControls {
  isPanning = false;

  isDragging = false;

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
  };

  mousedown = (event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    document.addEventListener('mouseup', this.mouseup, { once: true });
  };

  mouseup = (event: MouseEvent) => {
    if (event.defaultPrevented) return;

    this.mouseMovement.clear();

    this.handle({ type: ControlType.MOUSE_UP, event });

    document.removeEventListener('mousemove', this.mousemove);
  };

  click = (event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    if (this.isPanning) {
      this.isPanning = false;

      this.handle({ type: ControlType.END });
    } else if (this.isDragging) {
      this.isDragging = false;

      this.handle({ type: ControlType.END });

      return;
    }

    if (event.defaultPrevented) return;

    if (event.button !== 2) {
      event.stopPropagation();

      this.handle({ type: ControlType.CLICK, event });
    }
  };
}

export default MouseControls;
