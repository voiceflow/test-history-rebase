import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';

import { ejectUsersFromProject } from './sideEffects';

export const ejectUsersRPC = createRPC(Realtime.project.ejectUsers, ejectUsersFromProject);

export const rpcs = [ejectUsersRPC];
