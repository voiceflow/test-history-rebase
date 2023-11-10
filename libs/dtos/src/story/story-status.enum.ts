export const StoryStatus = {
  TO_DO: 'to_do',
  COMPLETE: 'complete',
  IN_PROGRESS: 'in_progress',
} as const;

export type StoryStatus = (typeof StoryStatus)[keyof typeof StoryStatus];
