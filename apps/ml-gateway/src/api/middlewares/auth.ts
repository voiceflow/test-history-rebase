import VError from '@voiceflow/verror';
import express from 'express';

import { ApiRequest } from '../types';
import { AbstractMiddleware } from './utils';

const AUTH_COOKIE = 'auth_vf';
const AUTH_HEADER = 'authorization';

export default class AuthorizationMiddleware extends AbstractMiddleware {
  async authenticateUser(req: ApiRequest, _res: express.Response, next: express.NextFunction) {
    const authToken = req.cookies[AUTH_COOKIE] || req.headers[AUTH_HEADER]?.replace('Bearer ', '');

    const user = authToken ? await this.services.user.getUserByToken(authToken) : null;

    if (!user) {
      throw new VError('unauthorized user', VError.HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user;

    next();
  }
}
