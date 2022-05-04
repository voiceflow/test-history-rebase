import type { BaseVoiceflowClient } from '@socket-utils/client';
import { ControlOptions } from '@socket-utils/control';

import { SyncService } from './sync';
import { UserService } from './user';
import { AbstractVoiceflowService } from './voiceflow';

export * from './manager';
export * from './sync';
export * from './user';
export * from './voiceflow';

export interface BaseServiceMap<VoiceflowClient extends BaseVoiceflowClient> {
  sync: SyncService;
  user: UserService;
  voiceflow: AbstractVoiceflowService<VoiceflowClient, ControlOptions>;
}
