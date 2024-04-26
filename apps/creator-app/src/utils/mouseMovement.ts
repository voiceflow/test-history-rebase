import mouseEventOffset from 'mouse-event-offset';

const MOUSE_BOUNDING_TOLERANCE = 1;

export default class MouseMovement {
  private event: null | MouseEvent = null;

  private movementX: null | number = null;

  private movementY: null | number = null;

  private prevClientX: null | number = null;

  private prevClientY: null | number = null;

  track(event: MouseEvent) {
    const { clientX, clientY, movementX, movementY } = event;

    const { prevClientX } = this;
    const { prevClientY } = this;

    this.prevClientX = clientX;
    this.prevClientY = clientY;

    if (prevClientX !== null && prevClientY !== null) {
      this.movementX = clientX - prevClientX;
      this.movementY = clientY - prevClientY;
    } else {
      this.movementX = movementX;
      this.movementY = movementY;
    }

    this.event = event;
  }

  getMovement() {
    return [this.movementX!, this.movementY!] as const;
  }

  getBoundedMovement() {
    const { clientWidth, clientHeight } = document.body;
    const [mouseX, mouseY] = mouseEventOffset(this.event!, document.body);

    const offsetX =
      mouseX <= MOUSE_BOUNDING_TOLERANCE || mouseX >= clientWidth - MOUSE_BOUNDING_TOLERANCE ? 0 : this.movementX!;
    const offsetY =
      mouseY <= MOUSE_BOUNDING_TOLERANCE || mouseY >= clientHeight - MOUSE_BOUNDING_TOLERANCE ? 0 : this.movementY!;

    return [offsetX, offsetY] as const;
  }

  clear() {
    this.event = null;
    this.movementX = null;
    this.movementY = null;
    this.prevClientX = null;
    this.prevClientY = null;
  }
}
