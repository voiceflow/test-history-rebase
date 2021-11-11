import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { baseCommandAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<Node.Command.StepData, NodeData.Command>(
  (data) => baseCommandAdapter.fromDB(data, { platform: Constants.PlatformType.GENERAL }),
  (data) => baseCommandAdapter.toDB(data, { platform: Constants.PlatformType.GENERAL })
);

export default commandAdapter;
