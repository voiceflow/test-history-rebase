import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { IntegrationActionType, IntegrationType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

const getAction = (action: string | undefined) => {
  switch (action) {
    case IntegrationActionType.CUSTOM_API.POST:
      return 'POST';
    case IntegrationActionType.CUSTOM_API.PUT:
      return 'PUT';
    case IntegrationActionType.CUSTOM_API.DELETE:
      return 'DELETE';
    case IntegrationActionType.CUSTOM_API.PATCH:
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
    icon: 'variable',
    iconColor: '#74a4bf',
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
    icon: 'googleSheets',
    iconColor: '#279745',
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
    icon: 'zapier',
    iconColor: '#e26d5a',
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

export type IntegrationStepProps = ConnectedStepProps['stepProps'] & {
  data: NodeData.Integration;
  successPortID: string;
  failurePortID: string;
};

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ data, withPorts, successPortID, failurePortID, isActive, onClick, lockOwner }) => {
  const step = IntegrationsStepMeta[data.selectedIntegration] as StepMeta<typeof data.selectedIntegration>;

  return (
    <Step isActive={isActive} onClick={onClick} lockOwner={lockOwner}>
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
            <FailureItem label="Failure" portID={failurePortID} />
            <SuccessItem label="Success" portID={successPortID} />
          </>
        )}
      </Section>
    </Step>
  );
};

const ConnectedIntegrationStep: React.FC<ConnectedStepProps<NodeData.Integration>> = ({ node, data, stepProps }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <IntegrationStep data={data} successPortID={successPortID} failurePortID={failurePortID} {...stepProps} />;
};

export default ConnectedIntegrationStep;
