import { Creator } from './Creator';

export type SessionUser = Partial<Creator> & {
  iat: number;
};
