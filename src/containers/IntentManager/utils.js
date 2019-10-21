const slotFormatRegex = /{{\[[^[\]{}]+]\.([\dA-Za-z]+)}}/g;

// eslint-disable-next-line import/prefer-default-export
export function getSlotKeys(input) {
  let slotFormat;
  const slotKeys = new Set();

  do {
    slotFormat = slotFormatRegex.exec(input);
    if (slotFormat) {
      const key = slotFormat[1];
      slotKeys.add(key);
    }
  } while (slotFormat);

  return Array.from(slotKeys);
}
