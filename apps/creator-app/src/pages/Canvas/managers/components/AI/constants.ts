import { BaseUtils } from '@voiceflow/base-types';

export const SOURCE_OPTIONS = [
  {
    id: BaseUtils.ai.DATA_SOURCE.DEFAULT,
    label: 'AI Model',
  },
  {
    id: BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE,
    label: 'Knowledge Base',
  },
];

export interface MemorySelectOption {
  mode: BaseUtils.ai.PROMPT_MODE;
  title: string;
  label?: string;
}
