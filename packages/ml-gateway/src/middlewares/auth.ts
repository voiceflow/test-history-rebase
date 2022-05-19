import { authenticateUser } from '@voiceflow/socket-utils';

import { AbstractLoguxControl } from '../control';

class AuthMiddleware extends AbstractLoguxControl {
  setup(): void {
    authenticateUser(this.server, async (_creatorID, _token) => {
      // TODO: authenticate user

      return false;
    });
  }
}

export default AuthMiddleware;
