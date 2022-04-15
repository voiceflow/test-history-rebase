export const isHexColor = (color: string): boolean => /^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i.test(color);
