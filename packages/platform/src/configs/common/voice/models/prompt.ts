export enum PromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export interface Model {
  id: string;
  type: PromptType;
  desc?: string | null;
  audio?: string | null;
  voice?: string | null;
  content: string;
}
