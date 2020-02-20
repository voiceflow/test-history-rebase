import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import IntegrationStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
  };
};

export default {
  title: 'Creator/Steps/Integration Step',
  component: IntegrationStep,
};

export const googleEmpty = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="GOOGLE" />
  </NewBlock>
);

export const apiEmpty = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="API" />
  </NewBlock>
);

export const zapierEmpty = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="ZAPIER" />
  </NewBlock>
);

export const googleFilled = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="GOOGLE" data={{ actionType: 'Get', sheetName: 'Voiceflow MRR' }} />
  </NewBlock>
);

export const apiFilled = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="API" data={{ actionType: 'GET' }} />
  </NewBlock>
);

export const zapierFilled = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="ZAPIER" data={{ triggerName: 'Send Slack Message' }} />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="ZAPIER" isConnectedSuccess isConnectedFailure />
  </NewBlock>
);

export const withoutPorts = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="ZAPIER" withPorts={false} />
  </NewBlock>
);

export const longLabel = () => (
  <NewBlock name="Block">
    <IntegrationStep {...getProps()} type="ZAPIER" data={{ triggerName: 'Send Slack Message blah blah blah' }} />
  </NewBlock>
);
