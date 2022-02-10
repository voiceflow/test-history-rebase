import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const zapierAdapter = createBlockAdapter<BaseNode.Zapier.StepData, NodeData.Zapier>(
  ({ value, user, selectedAction }) => ({
    user,
    value,
    selectedAction,
    selectedIntegration: BaseNode.Utils.IntegrationType.ZAPIER,
  }),
  ({ user, value = '', selectedAction = BaseNode.Zapier.ZapierActionType.START_A_ZAP }) => ({
    user,
    value: value ?? '',
    selectedAction: selectedAction as BaseNode.Zapier.ZapierActionType,
    selectedIntegration: BaseNode.Utils.IntegrationType.ZAPIER,
  })
);

export default zapierAdapter;
