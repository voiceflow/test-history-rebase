import type * as Base from '@platform-config/configs/base';
import type { ChatModels } from '@voiceflow/chat-types';

export interface Model extends Base.Models.Prompt.Model, ChatModels.Prompt {}
