import { BaseNode } from '@voiceflow/base-types';
import { Flex } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { Content } from '@/pages/Canvas/components/Editor';

import { DEFAULT_DATA } from '../../../../constants';
import { Integration, Title } from './components';

const INTEGRATION_OPTIONS = {
  CUSTOM_API: {
    type: 'Custom API',
    text: 'Custom API',
    tooltip: 'Make a Custom API Call',
    icon: 'custom',
  },
  GOOGLE_SHEETS: {
    type: 'Google Sheets',
    text: 'Google Sheets',
    tooltip: 'Manage Data stored on Google Sheets',
    icon: 'googleSheets',
  },
  ZAPIER: {
    type: 'Zapier',
    text: 'Zapier',
    tooltip: 'Trigger a Zap',
    icon: '',
  },
};

const ChoseIntegration = ({ onChange }) => (
  <Content>
    <Section>
      <Title>Choose an integration</Title>

      <Flex>
        <Integration data={INTEGRATION_OPTIONS.CUSTOM_API} onClick={() => onChange(DEFAULT_DATA[BaseNode.Utils.IntegrationType.CUSTOM_API])} />
      </Flex>

      <Flex>
        <Integration data={INTEGRATION_OPTIONS.GOOGLE_SHEETS} onClick={() => onChange(DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS])} />
        <Integration data={INTEGRATION_OPTIONS.ZAPIER} onClick={() => onChange(DEFAULT_DATA[BaseNode.Utils.IntegrationType.ZAPIER])} />
      </Flex>
    </Section>
  </Content>
);

export default ChoseIntegration;
