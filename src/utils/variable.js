import isVarName from 'is-var-name';
import _ from 'lodash'

const replacer = (match, inner, variables_map, url = false) => {
    if (inner in variables_map) {
        return url ? encodeURI(variables_map[inner]) : variables_map[inner];
    } else {
        return match;
    }
}

export const RegexVariables = (phrase, variables) => {
  if (!phrase || !phrase.trim()) {
    return ''
  } else {
    return phrase.replace(/\{([a-zA-Z0-9_]*)\}/g, (match, inner) => replacer(match, inner, variables, false))
  }
}

export const finder = string => {
    let regex = /\{([A-Za-z0-9_]*)\}/g;
    let match = regex.exec(string);
    let variables = []
    while (match != null) {
        if (isVarName(match[1]) && !_.includes(variables, match[1])) {
            variables.push(match[1]);
        }
        match = regex.exec(String);
    }
    return variables;
}