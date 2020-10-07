import { preventDefault } from '@/utils/dom';
import MouseMovement from '@/utils/mouseMovement';

import { ControlType } from '../constants';
import { ControlAction } from './types';
import { BaseControls, getScrollDelta } from './utils';

class MouseControls extends BaseControls {
  isPanning = false;

  isDragging = false;

  scrollComplete = null;

  mouseMovement = new MouseMovement();

  spacebarPressed = false;

  twoFingerOnTrackpad = false;

  constructor(props: { (action: ControlAction): void; (action: ControlAction): void }) {
    super(props);

    document.addEventListener('keydown', this.handleSpaceBarPress);
    document.addEventListener('keyup', this.handleSpaceBarLifted);
  }

  handleSpaceBarPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      this.spacebarPressed = true;
      document.body.style.cursor = 'grab';
    }
  };

  handleSpaceBarLifted = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      this.spacebarPressed = false;
      document.body.style.cursor = 'default';
    }
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

    event.preventDefault();

    // two-finger touch on trackpad
    this.twoFingerOnTrackpad = event.button === 2;

    this.isPanning = this.spacebarPressed || this.twoFingerOnTrackpad;
    if (this.isPanning) {
      document.addEventListener('mousemove', this.mousemove);
      this.handle({ type: ControlType.START_INTERACTION });
    } else {
      document.removeEventListener('mousemove', this.mousemove);
      this.isDragging = true;
      this.handle({ type: ControlType.SELECT_DRAG_START, event });
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
      this.handle({ type: ControlType.END_INTERACTION });
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
