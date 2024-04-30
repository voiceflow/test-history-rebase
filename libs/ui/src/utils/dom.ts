import { KeyName } from '@/constants';
import type { Point } from '@/types';

export enum DataTypes {
  TEXT = 'text/plain;charset=utf-8',
  JSON = 'text/json;charset=utf-8',
  CSV = 'text/csv;encoding:utf-8',
}

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

  try {
    outer.parentNode?.removeChild(outer);
  } catch (e) {
    document.body.removeChild(outer);
  }

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

export const stopImmediatePropagation = withHandler<React.SyntheticEvent>((e) =>
  e.nativeEvent.stopImmediatePropagation()
);

export const preventDefault = withHandler((e) => e.preventDefault());

export const swallowEvent = withHandler<Event | React.SyntheticEvent, boolean>((e, stopNativePropagation) => {
  e.stopPropagation();
  e.preventDefault();

  if (stopNativePropagation) {
    (e as Event).stopImmediatePropagation?.();
    (e as React.SyntheticEvent).nativeEvent?.stopImmediatePropagation();
  }
});

export const withTargetValue =
  (cb: (value: string) => void) =>
  (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void =>
    cb(event.currentTarget.value);

export const withKeyPress =
  <E extends KeyboardEvent | React.KeyboardEvent>(key: string, cb: (event: E) => void) =>
  (event: E): void => {
    if (event.key !== key) {
      return;
    }

    cb(event);
  };

export const swallowKeyPress = (key: string) => withKeyPress(key, preventDefault());

export const withEnterPress: {
  <E extends React.KeyboardEvent<any>>(cb: (event: E) => void): (event: E) => void;
  <E extends KeyboardEvent>(cb: (event: E) => void): (event: E) => void;
} = <E extends KeyboardEvent | React.KeyboardEvent<any>>(cb: (event: E) => void) => withKeyPress(KeyName.ENTER, cb);

export const withInputBlur =
  <E extends KeyboardEvent | React.KeyboardEvent>(cb?: (event: E) => void) =>
  (event: E): void => {
    (event.target as HTMLInputElement)?.blur();

    // eslint-disable-next-line callback-return
    cb?.(event);
  };

export const buildVirtualElement = (point: Point = [0, 0]) => {
  const rect = new DOMRect(point[0], point[1], 0, 0);

  return {
    getBoundingClientRect: () => rect,
    clientWidth: 0,
    clientHeight: 0,
  };
};

export const downloadFromURL = (filename: string, url: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const download = (filename: string, text: string, data = DataTypes.TEXT) => {
  downloadFromURL(filename, `data:${data},${encodeURIComponent(text)}`);
};

export const importScript = ({ id, uri, callbackName }: { id: string; uri: string; callbackName: string }) =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    const appendIn = document.getElementsByTagName('script')[0]?.parentNode ?? document.head;

    script.id = id;
    script.src = uri;
    script.async = true;
    script.onerror = reject;

    Object.assign(window, { [callbackName]: () => resolve() });

    appendIn.appendChild(script);
  });
