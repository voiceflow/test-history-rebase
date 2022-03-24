// eslint-disable-next-line import/prefer-default-export
export const isHexColor = (color: string): boolean => RegExp(/^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i).test(color);
