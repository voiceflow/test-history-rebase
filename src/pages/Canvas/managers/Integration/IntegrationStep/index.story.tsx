import React from 'react';

import { withStepContext } from '@/../.storybook';
import { INTEGRATION_DATA_MODELS, IntegrationType } from '@/constants';
import { NodeData } from '@/models';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { IntegrationStep, IntegrationStepProps } from '.';

const getProps = (): Omit<IntegrationStepProps, 'data'> => ({
  withPorts: true,
  successPortID: 'abc',
  failurePortID: 'abc',
});

const render = (props: Pick<IntegrationStepProps, 'data'> & Partial<Omit<IntegrationStepProps, 'data'>>) => () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Integration Step',
  component: IntegrationStep,
};

export const apiEmpty = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.CUSTOM_API,
      ...INTEGRATION_DATA_MODELS.CUSTOM_API,
    } as NodeData.CustomApi,
  })
);

export const apiFilled = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.CUSTOM_API,
      ...INTEGRATION_DATA_MODELS.CUSTOM_API,
      url: 'http://awesome-link.com',
    } as NodeData.CustomApi,
  })
);

export const googleEmpty = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.GOOGLE_SHEETS,
      ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS,
    } as NodeData.GoogleSheets,
  })
);

export const googleFilled = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.GOOGLE_SHEETS,
      ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS,
      selectedAction: 'Create Data',
      sheet: { value: 'abc', label: 'Voiceflow MRR' },
    } as NodeData.GoogleSheets,
  })
);

export const zapierEmpty = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.ZAPIER,
      ...INTEGRATION_DATA_MODELS.ZAPIER,
    } as NodeData.Zapier,
  })
);

export const zapierFilled = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.ZAPIER,
      ...INTEGRATION_DATA_MODELS.ZAPIER,
      value: 'Send Slack Message',
    } as NodeData.Zapier,
  })
);

export const noConnector = withStepContext()(
  render({
    withPorts: false,
    data: {
      integrationType: IntegrationType.CUSTOM_API,
      ...INTEGRATION_DATA_MODELS.CUSTOM_API,
      url: 'http://awesome-link.com',
    } as NodeData.CustomApi,
  })
);

export const active = withStepContext({ isActive: true })(
  render({
    data: {
      integrationType: IntegrationType.ZAPIER,
      ...INTEGRATION_DATA_MODELS.ZAPIER,
      value: 'Send Slack Message',
    } as NodeData.Zapier,
  })
);

export const connected = withStepContext({ isConnected: true })(
  render({
    data: {
      integrationType: IntegrationType.GOOGLE_SHEETS,
      ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS,
      selectedAction: 'Create Data',
      sheet: { value: 'abc', label: 'Voiceflow MRR' },
    } as NodeData.GoogleSheets,
  })
);

export const longLabel = withStepContext()(
  render({
    data: {
      integrationType: IntegrationType.GOOGLE_SHEETS,
      ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS,
      selectedAction: 'Create Data',
      sheet: { value: 'abc', label: 'Voiceflow Monthly Recurring Revenue' },
    } as NodeData.GoogleSheets,
  })
);
