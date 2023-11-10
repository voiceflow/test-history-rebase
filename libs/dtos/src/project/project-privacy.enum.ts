export const ProjectPrivacy = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type ProjectPrivacy = (typeof ProjectPrivacy)[keyof typeof ProjectPrivacy];
