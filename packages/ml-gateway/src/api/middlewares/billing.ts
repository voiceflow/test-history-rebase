import VError from '@voiceflow/verror';
import express from 'express';

import { ApiRequest } from '../types';
import { AbstractMiddleware } from './utils';

export default class BillingMiddleware extends AbstractMiddleware {
  async checkQuota(req: ApiRequest, _res: express.Response, next: express.NextFunction) {
    // Make a call billing service to determine if the call should proceeed
    const { data, status } = await this.services.billing.consumeGenerationQuota(req.body.workspaceID, 0);
    if (status === VError.HTTP_STATUS.FORBIDDEN) {
      throw new VError(data.message, VError.HTTP_STATUS.FORBIDDEN, data);
    }
    req.quota = data.quota;
    next();
  }
}
