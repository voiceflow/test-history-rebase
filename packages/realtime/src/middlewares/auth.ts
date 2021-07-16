import { AbstractLoguxControl } from '../control';

class AuthMiddleware extends AbstractLoguxControl {
  setup(): void {
    this.server.auth(async ({ userId, token }) => {
      const user = await this.services.user.getUserByToken(token);

      return user?.creator_id === Number(userId);
    });
  }
}

export default AuthMiddleware;
