import { AbstractLoguxControl, authenticateUser } from '@voiceflow/socket-utils';

import { LoguxControlOptions } from '../control';

class AuthMiddleware extends AbstractLoguxControl<LoguxControlOptions> {
  setup(): void {
    authenticateUser(this.server, async (creatorID, token) => {
      const user = await this.services.user.getUserByToken(token);

      return user?.creator_id === creatorID;
    });
  }
}

export default AuthMiddleware;
