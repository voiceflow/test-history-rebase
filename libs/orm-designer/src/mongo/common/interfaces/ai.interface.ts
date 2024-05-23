export type AIModelType =
  | 'text-davinci-003'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4o'
  | 'gpt-4-turbo'
  | 'claude-v1'
  | 'claude-v2'
  | 'claude-instant-v1'
  | 'gemini-pro';

export interface AIParams {
  stop?: string[];
  model?: AIModelType;
  system?: string;
  maxTokens?: number;
  temperature?: number;
}
