import { PROTOCOL_KEY, RPC_KEY } from '@realtime-sdk/constants';
import { Utils } from '@voiceflow/common';

const protocolType = Utils.protocol.typeFactory(PROTOCOL_KEY);
const protocolRPCType = Utils.protocol.typeFactory(protocolType(RPC_KEY));

// RPC

// eslint-disable-next-line import/prefer-default-export
export const reloadSession = Utils.protocol.createAction<null>(protocolRPCType('RELOAD_SESSION'));
