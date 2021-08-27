import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const zapierAdapter = createBlockAdapter<Node.Zapier.StepData, NodeData.Zapier>(
  ({ value, user, selectedAction }) => ({
    user,
    value,
    selectedAction,
    selectedIntegration: Node.Utils.IntegrationType.ZAPIER,
  }),
  ({ user, value = '', selectedAction = Node.Zapier.ZapierActionType.START_A_ZAP }) => ({
    user,
    value: value ?? '',
    selectedAction: selectedAction as Node.Zapier.ZapierActionType,
    selectedIntegration: Node.Utils.IntegrationType.ZAPIER,
  })
);

export default zapierAdapter;
