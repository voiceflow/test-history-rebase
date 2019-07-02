const REGEXPS = {
  VARIABLE: /^{[A-Za-z][.A-Za-z]*[A-Za-z]}$/,
};

export const containVariable = (value = '') => value.match(REGEXPS.VARIABLE);
