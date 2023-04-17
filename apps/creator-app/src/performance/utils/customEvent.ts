interface Options {
  detail?: number;
  altKey?: boolean;
  button?: number;
  clientX?: number;
  clientY?: number;
  ctlrKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  relatedTarget?: HTMLElement | null;
}

type PerfEvent = CustomEvent<any> & Record<string, any>;

const customEvent = (
  eventName: string,
  {
    detail = 0,
    altKey = false,
    button = 0,
    clientX,
    clientY,
    ctlrKey = false,
    metaKey = false,
    shiftKey = false,
    relatedTarget = null,
    ...customOptions
  }: Options & Record<string, any> = {}
): PerfEvent => {
  const event = document.createEvent('CustomEvent') as PerfEvent;

  event.initCustomEvent(eventName, true, true, detail ?? 0);

  event.view = window;
  event.altKey = altKey ?? false;
  event.button = button ?? 0;
  event.ctlrKey = ctlrKey ?? false;
  event.metaKey = metaKey ?? false;
  event.shiftKey = shiftKey ?? false;
  event.relatedTarget = relatedTarget ?? null;

  if (clientX && clientY) {
    event.screenX = window.screenX + clientX;
    event.screenY = window.screenY + clientY;
  }

  Object.keys(customOptions).forEach((key) => {
    event[key] = customOptions[key];
  });

  return event;
};

export default customEvent;
