const FORMAT = /^\w+(['+-.]\w+)*@\w+([.-]\w+)*\.\w+([.-]\w+)*$/;

// eslint-disable-next-line import/prefer-default-export
export const isValidEmail = (email) => email.match(FORMAT);
