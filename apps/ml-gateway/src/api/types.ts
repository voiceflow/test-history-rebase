import type { User } from '@voiceflow/socket-utils';
import express from 'express';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ApiRequest<P extends {} = {}, B = any, Q = any, RB = any> extends express.Request<P, RB, B, Q> {
  requestID?: string;
  quota?: any;
  user?: User;
}
