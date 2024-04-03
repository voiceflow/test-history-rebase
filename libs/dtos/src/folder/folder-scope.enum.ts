export const FolderScope = {
  FLOW: 'flow',
  EVENT: 'event',
  ENTITY: 'entity',
  INTENT: 'intent',
  PROMPT: 'prompt',
  PERSONA: 'persona',
  WORKFLOW: 'workflow',
  RESPONSE: 'response',
  VARIABLE: 'variable',
  FUNCTION: 'function',
  KNOWLEDGE_BASE: 'knowledge-base',
} as const;

export type FolderScope = (typeof FolderScope)[keyof typeof FolderScope];
