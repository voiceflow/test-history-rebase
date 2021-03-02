import { withStepContext } from '_storybook';
import React from 'react';

import { IntegrationType } from '@/constants';
import { NodeData } from '@/models';
import Block from '@/pages/Canvas/components/Block';

import { DEFAULT_DATA } from '../constants';
import { IntegrationStep, IntegrationStepProps } from '.';

const getProps = (): Omit<IntegrationStepProps, 'data'> => ({
  withPorts: true,
  nodeID: '111',
  successPortID: 'abc',
  failurePortID: 'abc',
});

const render = (props: Pick<IntegrationStepProps, 'data'> & Partial<Omit<IntegrationStepProps, 'data'>>) => () => (
  <Block name="Block">
    <IntegrationStep {...getProps()} {...props} />
  </Block>
);

export default {
  title: 'Creator/Steps/Integration Step',
  component: IntegrationStep,
};

export const apiEmpty = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.CUSTOM_API],
    } as NodeData.CustomApi,
  })
);

export const apiFilled = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.CUSTOM_API],
      url: 'http://awesome-link.com',
    } as NodeData.CustomApi,
  })
);

export const googleEmpty = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.GOOGLE_SHEETS],
    } as NodeData.GoogleSheets,
  })
);

export const googleFilled = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.GOOGLE_SHEETS],
      sheet: { value: 20, label: 'Voiceflow MRR' },
      selectedAction: 'Create Data',
    } as NodeData.GoogleSheets,
  })
);

export const zapierEmpty = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.ZAPIER],
    } as NodeData.Zapier,
  })
);

export const zapierFilled = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.ZAPIER],
      value: 'Send Slack Message',
    } as NodeData.Zapier,
  })
);

export const noConnector = withStepContext()(
  render({
    withPorts: false,
    data: {
      ...DEFAULT_DATA[IntegrationType.CUSTOM_API],
      url: 'http://awesome-link.com',
    } as NodeData.CustomApi,
  })
);

export const active = withStepContext({ isActive: true })(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.ZAPIER],
      value: 'Send Slack Message',
    } as NodeData.Zapier,
  })
);

export const connected = withStepContext({ isConnected: true })(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.GOOGLE_SHEETS],
      selectedAction: 'Create Data',
      sheet: { value: 0, label: 'Voiceflow MRR' },
    } as NodeData.GoogleSheets,
  })
);

export const longLabel = withStepContext()(
  render({
    data: {
      ...DEFAULT_DATA[IntegrationType.GOOGLE_SHEETS],
      selectedAction: 'Create Data',
      sheet: { value: 0, label: 'Voiceflow Monthly Recurring Revenue' },
    } as NodeData.GoogleSheets,
  })
);
