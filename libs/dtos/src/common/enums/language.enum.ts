export const Language = {
  ENGLISH_US: 'en-us',
} as const;

export type Language = (typeof Language)[keyof typeof Language];
