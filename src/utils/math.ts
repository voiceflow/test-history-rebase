// eslint-disable-next-line import/prefer-default-export
export const getRotation = (offsetX: number, offsetY: number) => {
  const angle = Math.atan(offsetX / offsetY);

  const radians = offsetY > 0 ? angle : Math.PI + angle;

  // eslint-disable-next-line no-restricted-globals
  return isNaN(radians) ? 0 : radians;
};
