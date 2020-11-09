import { IntegrationType } from '@voiceflow/general-types';
import { StepData, ZapierActionType } from '@voiceflow/general-types/build/nodes/zapier';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const zapierAdapter = createBlockAdapter<StepData, NodeData.Zapier>(
  ({ value, user, selectedAction }) => ({
    user,
    value,
    selectedAction,
    selectedIntegration: IntegrationType.ZAPIER,
  }),
  ({ user, value = '', selectedAction = ZapierActionType.START_A_ZAP }) => ({
    user,
    value: value ?? '',
    selectedAction: selectedAction as ZapierActionType,
    selectedIntegration: IntegrationType.ZAPIER,
  })
);

export default zapierAdapter;
