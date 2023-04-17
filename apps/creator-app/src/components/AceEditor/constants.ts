export enum InputMode {
  INPUT = 'input',
}

export const ACE_EDITOR_OPTIONS = {
  tabSize: 2,
  useWorker: false,
  enableSnippets: false,
  showLineNumbers: true,
  enableLiveAutocompletion: true,
  enableBasicAutocompletion: true,
};

export const ACE_EDITOR_COLORS = {
  defaultColor: '#0b1a38',
  regexp: '#92564b',
  boolean: '#1c368e',
  comment: '#8da2b5',
  reservedWord: '#1c368e',
  string: '#92564b',
  numeric: 'rgb(0, 0, 205)',
  variable: '#A156D7',
};

export const ACE_EDITOR_OPTIONS_V2 = {
  ...ACE_EDITOR_OPTIONS,
  fontFamily: 'Fira Code',
};

export type AceEditorColors = typeof ACE_EDITOR_COLORS;
