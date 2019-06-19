import isVarName from 'is-var-name';
import _ from 'lodash';

const replacer = (match, inner, variables_map, url = false) => {
  if (inner in variables_map) {
    return url ? encodeURI(variables_map[inner]) : variables_map[inner];
  }
  return match;
};

export const RegexVariables = (phrase, variables) => {
  if (!phrase || !phrase.trim()) {
    return '';
  }
  return phrase.replace(/{(\w*)}/g, (match, inner) => replacer(match, inner, variables, false));
};

export const finder = (string) => {
  const regex = /{(\w*)}/g;
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
