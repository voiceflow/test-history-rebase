export enum InputMode {
  INPUT = 'input',
}

export const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
  useWorker: false,
};

export const ACE_EDITOR_COLORS = {
  defaultColor: '#0b1a38',
  regexp: '#92564b',
  boolean: '#1c368e',
  comment: '#8da2b5',
  reservedWord: '#1c368e',
  string: 'rgb(3, 106, 7)',
  numeric: 'rgb(0, 0, 205)',
  variable: '#A156D7',
};

export const ACE_EDITOR_OPTIONS_V2 = {
  ...ACE_EDITOR_OPTIONS,
  fontFamily: 'Fira Code',
};

export type AceEditorColors = typeof ACE_EDITOR_COLORS;
