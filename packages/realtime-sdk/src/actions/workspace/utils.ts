import { WORKSPACE_KEY } from '@realtime-sdk/constants';
import { Utils } from '@voiceflow/common';

// eslint-disable-next-line import/prefer-default-export
export const workspaceType = Utils.protocol.typeFactory(WORKSPACE_KEY);
