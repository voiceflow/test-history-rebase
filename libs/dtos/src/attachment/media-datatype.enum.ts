export const MediaDatatype = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export type MediaDatatype = (typeof MediaDatatype)[keyof typeof MediaDatatype];
