import { preventDefault } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import { ClassName } from '@/styles/constants';
import MouseMovement from '@/utils/mouseMovement';

import { ControlType } from '../../constants';
import { BaseControls, getScrollDelta } from '../utils';

class Controls extends BaseControls {
  isPanning = false;

  isDragging = false;

  scrollComplete: NodeJS.Timeout | null = null;

  mouseMovement = new MouseMovement();

  spacebarPressed = false;

  keydown = (event: KeyboardEvent) => {
    if (
      event.code === 'Space' &&
      !(event.target as HTMLElement)?.closest(`.${ClassName.CANVAS_NODE}--${BlockType.MARKUP_TEXT}`)
    ) {
      this.spacebarPressed = true;
      this.handle({ type: ControlType.START_INTERACTION });
    }
  };

  keyup = (event: KeyboardEvent) => {
    if (
      event.code === 'Space' &&
      !(event.target as HTMLElement)?.closest(`.${ClassName.CANVAS_NODE}--${BlockType.MARKUP_TEXT}`)
    ) {
      this.spacebarPressed = false;

      if (!this.isPanning) {
        this.handle({ type: ControlType.END_INTERACTION });
      }
    }
  };

  startPanning = () => {
    document.addEventListener('mousemove', this.mousemove);
    this.handle({ type: ControlType.START_INTERACTION });
  };

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

      this.handle({ type: ControlType.SELECT_DRAG_START, event });
    } else {
      this.isPanning = true;

      document.addEventListener('mousemove', this.mousemove);

      this.handle({ type: ControlType.START_INTERACTION });
    }
  };

  mousedown = (event: MouseEvent) => {
    if (event.defaultPrevented) return;

    // middle mouse button clicked
    if (event.button === 1) {
      this.startPanning();
    }

    if (!event.shiftKey && this.spacebarPressed) {
      this.handle({ type: ControlType.START_PANNING });
    }

    document.addEventListener('mouseup', this.mouseup, { once: true });
  };

  mouseup = (event: MouseEvent) => {
    if (event.defaultPrevented) return;

    this.mouseMovement.clear();

    this.handle({ type: ControlType.MOUSE_UP, event });
    this.handle({ type: ControlType.END_INTERACTION });
    this.handle({ type: ControlType.STOP_PANNING });

    // finished panning with middle click
    if (event.button === 1) {
      this.handle({ type: ControlType.END });
    }

    document.removeEventListener('mousemove', this.mousemove);
  };

  click = (event: React.MouseEvent) => {
    if (event.defaultPrevented) return;

    if (this.isPanning) {
      this.isPanning = false;

      this.handle({ type: ControlType.END });
      this.handle({ type: ControlType.END_INTERACTION });
    } else if (this.isDragging) {
      this.isDragging = false;

      this.handle({ type: ControlType.END });

      return;
    }

    if (event.defaultPrevented) return;

    if (event.button !== 2) {
      this.handle({ type: ControlType.CLICK, event });
    }
  };
}

export default Controls;
