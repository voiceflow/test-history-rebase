import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const variableInputValueIsEmpty = (valueArray) => {
  let notEmpty = false;

  if (valueArray[0] && !_.isObject(valueArray[0])) {
    notEmpty = valueArray.length > 1 || valueArray[0].trim().length > 0;
  }
  if (_.isObject(valueArray[0])) notEmpty = true;
  return !notEmpty;
};
