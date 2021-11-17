import { Utils } from '@voiceflow/common';

import { WORKSPACE_KEY } from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const workspaceType = Utils.protocol.typeFactory(WORKSPACE_KEY);
