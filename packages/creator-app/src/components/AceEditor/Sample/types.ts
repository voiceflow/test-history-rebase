export enum Language {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  JSON = 'json',
}

export interface Sample {
  label: string;
  language: Language;
  sample: string;
}
