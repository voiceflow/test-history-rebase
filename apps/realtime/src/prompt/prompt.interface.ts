import type { PromptORM } from '@voiceflow/orm-designer';

import type { CreateOneData } from '@/common/types';

export interface PromptCreateData extends CreateOneData<PromptORM> {}

export interface PromptCreateRefData extends Pick<PromptCreateData, 'text' | 'personaID'> {
  name?: string;
}
