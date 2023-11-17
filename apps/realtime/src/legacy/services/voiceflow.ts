import { MemoizedClient } from '@/common';

import { AbstractControl } from '../control';

class VoiceflowService extends AbstractControl {
  public client = new MemoizedClient(
    () => this.services.user,
    (token) => this.clients.voiceflowFactory(token)
  );
}

export default VoiceflowService;
