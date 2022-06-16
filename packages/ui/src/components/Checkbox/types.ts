export enum Type {
  DASH = 'dash',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
}

export enum Color {
  ERROR = '#e91e63',
  DEFAULT = '#5d9df5',
  DISABLED = '#8da2b5',
}

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: Type;
  error?: boolean;
  isFlat?: boolean;
  padding?: boolean;
}
