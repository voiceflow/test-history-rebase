import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';

import { ejectFromWorkspace } from './sideEffects';

export const ejectMemberRPC = createRPC(Realtime.workspace.member.eject, ejectFromWorkspace);

export const rpcs = [ejectMemberRPC];
