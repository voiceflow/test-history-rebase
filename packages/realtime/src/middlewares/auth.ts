import { AbstractLoguxControl } from '../control';

class AuthMiddleware extends AbstractLoguxControl {
  setup(): void {
    this.server.auth(async ({ userId, token }) => {
      const creatorID = Number(userId);

      if (Number.isNaN(creatorID)) return false;

      const user = await this.services.user.getUserByToken(token);

      return user?.creator_id === creatorID;
    });
  }
}

export default AuthMiddleware;
