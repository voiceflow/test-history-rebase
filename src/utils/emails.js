/* eslint-disable import/prefer-default-export */

const FORMAT = /^\w+(['+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const isValidEmail = (email) => {
  return email.match(FORMAT);
};
