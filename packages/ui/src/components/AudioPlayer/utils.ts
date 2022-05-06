import _isNumber from 'lodash/isNumber';

export const formatDigit = (number: number) => {
  const flooredNumber = Math.floor(number);
  return `0${flooredNumber}`.slice(-2);
};

export const formatTime = (num: number | null) => {
  if (!_isNumber(num)) {
    return '00:00';
  }
  const minutes = formatDigit(Math.floor(num / 60 / 60));
  const seconds = formatDigit(num % 60);
  return `${minutes}:${seconds}`;
};
