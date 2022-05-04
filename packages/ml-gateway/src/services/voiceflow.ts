import { AbstractVoiceflowService } from '@voiceflow/socket-utils';
import moize from 'moize';

import type { Client as VoiceflowClient } from '@/clients/voiceflow';

import { ControlOptions } from '../control';

class VoiceflowService extends AbstractVoiceflowService<VoiceflowClient, ControlOptions> {
  protected getMoizedClient = moize((token: string) => this.clients.voiceflowFactory(token), {
    maxAge: AbstractVoiceflowService.MAX_CACHE_AGE,
    maxSize: AbstractVoiceflowService.MAX_CACHE_SIZE,
  });
}

export default VoiceflowService;
