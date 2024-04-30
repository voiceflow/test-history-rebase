import { Utils } from '@voiceflow/common';

import { PROTOCOL_KEY, RPC_KEY } from '@/constants';

const protocolType = Utils.protocol.typeFactory(PROTOCOL_KEY);
const protocolRPCType = Utils.protocol.typeFactory(protocolType(RPC_KEY));

// RPC

export const reloadSession = Utils.protocol.createAction<null>(protocolRPCType('RELOAD_SESSION'));
