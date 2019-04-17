export const validateNumber = (value, { max, maxLength }) =>
  Number.isNaN(+value) ||
  (max && value > max) ||
  value.startsWith('00') ||
  (maxLength && value.length >= maxLength);

export const validateInteger = (value, { max, maxLength }) =>
  `${value}`.includes('.') || validateNumber(value, { max, maxLength });
