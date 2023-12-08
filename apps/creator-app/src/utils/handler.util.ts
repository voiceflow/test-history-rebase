export const withHandler =
  <E extends Event | React.BaseSyntheticEvent, O = never>(task: (event: E, options?: O) => void) =>
  <T extends E>(callback?: ((event: T) => void) | null, options?: O) =>
  // eslint-disable-next-line consistent-return
  (event: T) => {
    task(event, options);

    if (callback) {
      return callback(event);
    }
  };

export const stopPropagation = withHandler<React.SyntheticEvent, { immediate?: boolean }>((event, { immediate } = {}) => {
  event.stopPropagation();

  if (immediate!) return;

  event.nativeEvent.stopImmediatePropagation();
});

export const stopImmediatePropagation = withHandler<React.SyntheticEvent>((event) => event.nativeEvent.stopImmediatePropagation());

export const preventDefault = withHandler((event) => event.preventDefault());

export const swallowEvent = withHandler<Event | React.SyntheticEvent, { immediate?: boolean }>((event, { immediate } = {}) => {
  event.stopPropagation();
  event.preventDefault();

  if (!immediate) return;

  if (event instanceof Event) {
    event.stopImmediatePropagation();
  } else {
    event.nativeEvent.stopImmediatePropagation();
  }
});

export const withTargetValue =
  (callback: (value: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
    callback(event.currentTarget.value);

export const withKeyPress =
  <E extends KeyboardEvent | React.KeyboardEvent, Args extends any[] = never[]>(key: string, callback: (event: E, ...args: Args) => void) =>
  (event: E, ...args: Args): void => {
    if (event.key !== key) return;

    callback(event, ...args);
  };

export const swallowKeyPress = (key: string) => withKeyPress(key, preventDefault());

export const withEnterPress: {
  <E extends React.KeyboardEvent<any>, Args extends any[] = never[]>(callback: (event: E, ...args: Args) => void): (event: E, ...args: Args) => void;
  <E extends KeyboardEvent, Args extends any[] = never[]>(callback: (event: E, ...args: Args) => void): (event: E, ...args: Args) => void;
} = <E extends KeyboardEvent | React.KeyboardEvent<any>, Args extends any[] = never[]>(callback: (event: E, ...args: Args) => void) =>
  withKeyPress('Enter', callback);

export const withInputBlur =
  <E extends KeyboardEvent | React.KeyboardEvent>(callback?: (event: E) => void) =>
  (event: E): void => {
    (event.target as HTMLInputElement)?.blur?.();

    // eslint-disable-next-line callback-return
    callback?.(event);
  };
