import type { ChatModels } from '@voiceflow/chat-types';

import type * as Base from '@/configs/base';

export interface Model extends Base.Models.Prompt.Model, ChatModels.Prompt {}
