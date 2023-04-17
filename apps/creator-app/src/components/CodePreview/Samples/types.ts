export enum Language {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  JSON = 'json',
  SHELL = 'sh',
}

export interface Sample {
  label: string;
  language: Language;
  sample: string;
}
