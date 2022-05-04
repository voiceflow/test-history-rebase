import { AbstractControl, ControlOptions } from '@socket-utils/control';

export abstract class AbstractVoiceflowService<VoiceflowClient, Options extends ControlOptions> extends AbstractControl<Options> {
  public static MAX_CACHE_AGE = 8 * 60 * 60 * 1000; // 8 hours

  public static MAX_CACHE_SIZE = 1000;

  // FIXME: need to explicitly define this, some issue with type resolution across projects
  protected clients!: Options['clients'];

  protected abstract getMoizedClient: (token: string) => VoiceflowClient;

  // FIXME: needed to explicitly add this constructor for it to be reusable for some reason
  // without it other projects think it doesn't take any arguments
  constructor(options: Options) {
    super(options);
  }

  public async getClientByUserID(userID: number): Promise<VoiceflowClient> {
    const token = await this.services.user.getUserTokenByID(userID);

    if (!token) {
      throw new Error('Token not found');
    }

    return this.getMoizedClient(token);
  }

  public getClientByToken(token: string): VoiceflowClient {
    return this.getMoizedClient(token);
  }
}
