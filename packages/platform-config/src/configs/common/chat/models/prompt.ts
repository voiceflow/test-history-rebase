import * as Base from '@platform-config/configs/base';
import { ChatModels } from '@voiceflow/chat-types';

export interface Model extends Base.Models.Prompt.Model, ChatModels.Prompt {}
