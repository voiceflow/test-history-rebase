import moize from 'moize';

import { Client as Voiceflow } from '../clients/voiceflow';
import { AbstractControl } from '../control';

const MAX_CACHE_AGE = 8 * 60 * 60 * 1000; // 8 hours
const MAX_CACHE_SIZE = 1000;

class VoiceflowService extends AbstractControl {
  private getMoizedClient = moize((token: string) => this.clients.voiceflowFactory(token), {
    maxAge: MAX_CACHE_AGE,
    maxSize: MAX_CACHE_SIZE,
  });

  public async getClientByUserID(userID: number): Promise<Voiceflow> {
    const token = await this.services.user.getTokenByID(userID);

    if (!token) {
      throw new Error('Token not found');
    }

    return this.getMoizedClient(token);
  }

  public getClientByToken(token: string): Voiceflow {
    return this.getMoizedClient(token);
  }
}

export default VoiceflowService;
