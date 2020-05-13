/* eslint-disable import/prefer-default-export */

const FORMAT = /^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/;

export const isValidEmail = (email) => {
  return email.match(FORMAT);
};

export const isValueDuplicate = (value, list, attr) => {
  return list.filter((item) => (attr ? item[attr] === value : item === value)).length > 1;
};
