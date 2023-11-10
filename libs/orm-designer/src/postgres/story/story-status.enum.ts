export const StoryStatus = {
  TO_DO: 'to_do',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete',
} as const;

export type StoryStatus = (typeof StoryStatus)[keyof typeof StoryStatus];
