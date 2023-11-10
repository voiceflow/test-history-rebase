export const Channel = {
  DEFAULT: 'default',
} as const;

export type Channel = (typeof Channel)[keyof typeof Channel];
