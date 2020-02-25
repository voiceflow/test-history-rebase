import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

const IntegrationsStepMeta = {
  API: {
    icon: 'variable',
    iconColor: '#74a4bf',
    placeholder: 'Custom API',
    getLabel: ({ actionType }) => {
      const actionString = (
        <>
          Send <VariableLabel>{actionType}</VariableLabel> request
        </>
      );
      return actionType ? actionString : '';
    },
  },
  GOOGLE: {
    icon: 'googleSheets',
    iconColor: '#279745',
    placeholder: 'Connect a Google Sheet',
    getLabel: ({ actionType, sheetName }) => {
      return actionType && sheetName ? `${actionType} data in '${sheetName}'` : '';
    },
  },
  ZAPIER: {
    icon: 'zapier',
    iconColor: '#e26d5a',
    placeholder: 'Trigger a Zap',
    getLabel: ({ triggerName }) => {
      return triggerName ? `Trigger '${triggerName}'` : '';
    },
  },
};

function IntegrationStep({ data = {}, type, isConnectedSuccess, onClickSuccessPort, isConnectedFailure, onClickFailurePort, withPorts = true }) {
  return (
    <Step>
      <Section>
        <Item
          label={IntegrationsStepMeta[type].getLabel(data)}
          placeholder={IntegrationsStepMeta[type].placeholder}
          withPort={false}
          labelVariant="secondary"
          icon={IntegrationsStepMeta[type].icon}
          iconColor={IntegrationsStepMeta[type].iconColor}
        />
      </Section>
      {withPorts && (
        <Section>
          <FailureItem isConnected={isConnectedFailure} onClickPort={onClickFailurePort} />
          <SuccessItem isConnected={isConnectedSuccess} onClickPort={onClickSuccessPort} />
        </Section>
      )}
    </Step>
  );
}

export default IntegrationStep;
