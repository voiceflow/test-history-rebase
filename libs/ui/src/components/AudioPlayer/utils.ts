import _isNumber from 'lodash/isNumber';

export const formatDigit = (number: number) => {
  const flooredNumber = Math.floor(number);

  return String(flooredNumber).slice(-2);
};

export const formatTime = (num: number | null) => {
  if (!_isNumber(num)) {
    return '0:00';
  }

  const minutes = formatDigit(Math.floor(num / 60 / 60));
  const seconds = formatDigit(num % 60);

  return `${minutes}:${seconds.padStart(2, '0')}`;
};
