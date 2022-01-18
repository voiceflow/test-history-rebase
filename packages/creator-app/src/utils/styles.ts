// eslint-disable-next-line import/prefer-default-export

export const toSixCharHex = (hex: string): string =>
  hex.length > 6
    ? hex.substring(1)
    : hex
        .substring(1)
        .split('')
        .flatMap((char) => [char, char])
        .join('');

export const hexToRGBA = (hexString: string, opacity = 1): string => {
  if (!/^#([\dA-Fa-f]{3}){1,2}$/.test(hexString)) {
    return '';
  }
  const hex = Number(`0x${toSixCharHex(hexString)}`);
  // eslint-disable-next-line no-bitwise
  return `rgba(${[(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].join(',')},${opacity})`;
};
