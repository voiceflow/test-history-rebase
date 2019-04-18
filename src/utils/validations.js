const REGEXPS = {
  VARIABLE: /^\{[a-zA-Z][a-zA-Z.]*[a-zA-Z]\}$/,
};

export const containVariable = (value = '') => value.match(REGEXPS.VARIABLE);
