import _isObject from 'lodash/isObject';

export const variableInputValueIsEmpty = (valueArray) => {
  let notEmpty = false;

  if (valueArray[0] && !_isObject(valueArray[0])) {
    notEmpty = valueArray.length > 1 || valueArray[0].trim().length > 0;
  }
  if (_isObject(valueArray[0])) notEmpty = true;
  return !notEmpty;
};
