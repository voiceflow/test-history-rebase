// eslint-disable-next-line import/prefer-default-export
export const getRotation = (offsetX: number, offsetY: number) => {
  const angle = Math.atan(offsetX / offsetY);

  return offsetY > 0 ? angle : Math.PI + angle;
};
