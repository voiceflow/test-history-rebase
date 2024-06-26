export const ResponseVariantType = {
  PROMPT: 'prompt',

  /**
   * only available if the default interface is text
   */
  TEXT: 'text',
} as const;

export type ResponseVariantType = (typeof ResponseVariantType)[keyof typeof ResponseVariantType];
