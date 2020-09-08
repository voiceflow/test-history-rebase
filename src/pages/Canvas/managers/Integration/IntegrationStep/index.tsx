import { APIActionType } from '@voiceflow/alexa-types/build/nodes/api';
import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { IntegrationType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

import { ICON, ICON_COLOR } from '../constants';

const getAction = (action: string | undefined) => {
  switch (action) {
    case APIActionType.POST:
      return 'POST';
    case APIActionType.PUT:
      return 'PUT';
    case APIActionType.DELETE:
      return 'DELETE';
    case APIActionType.PATCH:
      return 'PATCH';
    default:
      return 'GET';
  }
};

type StepMeta<T extends IntegrationType> = {
  icon: Icon;
  iconColor: string;
  placeholder: string;
  getLabel: (data: NodeData.TypedIntegration[T]) => JSX.Element | string;
};

type IntegrationsStepMetaType = {
  [K in IntegrationType]: StepMeta<K>;
};

const IntegrationsStepMeta: IntegrationsStepMetaType = {
  [IntegrationType.CUSTOM_API]: {
    icon: ICON[IntegrationType.CUSTOM_API],
    iconColor: ICON_COLOR[IntegrationType.CUSTOM_API],
    placeholder: 'Custom API',
    getLabel: ({ selectedAction, url }) => {
      const label = (
        <>
          Send <VariableLabel>{getAction(selectedAction)}</VariableLabel> request
        </>
      );
      return url ? label : '';
    },
  },
  [IntegrationType.GOOGLE_SHEETS]: {
    icon: ICON[IntegrationType.GOOGLE_SHEETS],
    iconColor: ICON_COLOR[IntegrationType.GOOGLE_SHEETS],
    placeholder: 'Connect a Google Sheet',
    getLabel: ({ selectedAction, sheet }) => {
      const label = (
        <>
          {selectedAction} in <VariableLabel>{sheet?.label}</VariableLabel>
        </>
      );
      return selectedAction && sheet?.label ? label : '';
    },
  },
  [IntegrationType.ZAPIER]: {
    icon: ICON[IntegrationType.ZAPIER],
    iconColor: ICON_COLOR[IntegrationType.ZAPIER],
    placeholder: 'Trigger a Zap',
    getLabel: ({ user }) => {
      const label = (
        <>
          Trigger '<VariableLabel>{user?.user_data?.name}</VariableLabel>'
        </>
      );

      return user?.user_data ? label : '';
    },
  },
};

export type IntegrationStepProps = {
  data: NodeData.Integration;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
};

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ data, withPorts, successPortID, failurePortID }) => {
  const step = IntegrationsStepMeta[data.selectedIntegration] as StepMeta<typeof data.selectedIntegration>;

  return (
    <Step>
      <Section>
        <Item
          label={step.getLabel(data)}
          placeholder={step.placeholder}
          labelVariant={StepLabelVariant.SECONDARY}
          icon={step.icon}
          iconColor={step.iconColor}
        />
      </Section>
      <Section>
        {withPorts && (
          <>
            <SuccessItem label="Success" portID={successPortID} />
            <FailureItem label="Failure" portID={failurePortID} />
          </>
        )}
      </Section>
    </Step>
  );
};

const ConnectedIntegrationStep: React.FC<ConnectedStepProps<NodeData.Integration>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <IntegrationStep data={data} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />;
};

export default ConnectedIntegrationStep;
