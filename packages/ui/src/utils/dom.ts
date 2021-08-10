/**
 * Get the width of the browser scrollbar
 */
export const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;

  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;

  outer.parentNode?.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

export const withHandler =
  <E extends Event | React.BaseSyntheticEvent, O = never>(task: (event: E, options?: O) => void) =>
  <T extends E>(cb?: ((event: T) => void) | null, options?: O) =>
  // eslint-disable-next-line consistent-return
  (event: T) => {
    task(event, options);

    if (cb) {
      return cb(event);
    }
  };

export const stopPropagation = withHandler<React.SyntheticEvent, boolean>((e, stopNativePropagation) => {
  e.stopPropagation();

  if (stopNativePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
});

export const stopImmediatePropagation = withHandler<React.SyntheticEvent>((e) => e.nativeEvent.stopImmediatePropagation());

export const preventDefault = withHandler((e) => e.preventDefault());

export const swallowEvent = withHandler<Event | React.SyntheticEvent, boolean>((e, stopNativePropagation) => {
  e.stopPropagation();
  e.preventDefault();

  if (stopNativePropagation) {
    (e as Event).stopImmediatePropagation?.();
    (e as React.SyntheticEvent).nativeEvent?.stopImmediatePropagation();
  }
});
