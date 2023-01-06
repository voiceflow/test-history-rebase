import { duckLogger } from '@/ducks/utils';

import { STATE_KEY } from './constants';

export const log = duckLogger.child(STATE_KEY);

export const extractMemberById = <T extends { creator_id: number | null }>(members: T[], creatorID: number): T | null =>
  members.find((member) => member.creator_id === creatorID) ?? null;
