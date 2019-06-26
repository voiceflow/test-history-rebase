import isVarName from 'is-var-name';
import _ from 'lodash';

const regex = /{(\w*)}/g;

const replacer = (match, inner, variablesMap, url = false) => {
  if (inner in variablesMap) {
    return url ? encodeURI(variablesMap[inner]) : variablesMap[inner];
  }
  return match;
};

export const RegexVariables = (phrase, variables) => {
  if (!phrase || !phrase.trim()) {
    return '';
  }
  return phrase.replace(regex, (match, inner) => replacer(match, inner, variables, false));
};

export const finder = (string) => {
  let match = regex.exec(string);
  const variables = [];
  while (match != null) {
    if (isVarName(match[1]) && !_.includes(variables, match[1])) {
      variables.push(match[1]);
    }
    match = regex.exec(String);
  }
  return variables;
};
