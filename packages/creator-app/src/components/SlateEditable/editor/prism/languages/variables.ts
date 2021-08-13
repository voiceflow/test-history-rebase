import type { Grammar } from 'prismjs';

export enum VariablesProperty {
  VARIABLE = 'vfVariable',
}

const VARIABLES: Grammar = {
  [VariablesProperty.VARIABLE]: /{[\s\w]*}?/,
};

export default VARIABLES;
