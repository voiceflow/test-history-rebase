export const AttachmentType = {
  CARD: 'card',
  MEDIA: 'media',
} as const;

export type AttachmentType = (typeof AttachmentType)[keyof typeof AttachmentType];
