import mouseEventOffset from 'mouse-event-offset';

const MOUSE_BOUNDING_TOLERANCE = 1;

export default class MouseMovement {
  movementX = null;

  movementY = null;

  prevClientX = null;

  prevClientY = null;

  track(event) {
    const { clientX, clientY, movementX, movementY } = event;

    const prevClientX = this.prevClientX;
    const prevClientY = this.prevClientY;

    this.prevClientX = clientX;
    this.prevClientY = clientY;

    if (prevClientX === null) {
      this.movementX = movementX;
      this.movementY = movementY;
    } else {
      this.movementX = clientX - prevClientX;
      this.movementY = clientY - prevClientY;
    }

    this.event = event;
  }

  getMovement() {
    return [this.movementX, this.movementY];
  }

  getBoundedMovement() {
    const { clientWidth, clientHeight } = document.body;
    const [mouseX, mouseY] = mouseEventOffset(this.event, document.body);

    /* eslint-disable no-nested-ternary */
    const offsetX = mouseX <= MOUSE_BOUNDING_TOLERANCE || mouseX >= clientWidth - MOUSE_BOUNDING_TOLERANCE ? 0 : this.movementX;
    const offsetY = mouseY <= MOUSE_BOUNDING_TOLERANCE || mouseY >= clientHeight - MOUSE_BOUNDING_TOLERANCE ? 0 : this.movementY;
    /* eslint-enable no-nested-ternary */

    return [offsetX, offsetY];
  }

  clear() {
    this.event = null;
    this.movementX = null;
    this.movementY = null;
    this.prevClientX = null;
    this.prevClientY = null;
  }
}
