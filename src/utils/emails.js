/* eslint-disable import/prefer-default-export */

const FORMAT = /^\w+(['+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const isValidEmail = (email) => {
  return email.match(FORMAT);
};

export const isValueDuplicate = (value, list, attr) => {
  return list.filter((item) => (attr ? item[attr] === value : item === value)).length > 1;
};
