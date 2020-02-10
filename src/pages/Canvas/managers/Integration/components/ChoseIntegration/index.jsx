import React from 'react';

import Flex from '@/components/Flex';
import Section from '@/components/Section';
import { INTEGRATION_DATA_MODELS } from '@/constants';
import { Content } from '@/pages/Canvas/components/Editor';

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

function ChoseIntegration({ onChange }) {
  return (
    <Content>
      <Section>
        <Title>Choose an integration</Title>

        <Flex>
          <Integration data={INTEGRATION_OPTIONS.CUSTOM_API} onClick={() => onChange(INTEGRATION_DATA_MODELS.CUSTOM_API)} />
        </Flex>

        <Flex>
          <Integration data={INTEGRATION_OPTIONS.GOOGLE_SHEETS} onClick={() => onChange(INTEGRATION_DATA_MODELS.GOOGLE_SHEETS)} />
          <Integration data={INTEGRATION_OPTIONS.ZAPIER} onClick={() => onChange(INTEGRATION_DATA_MODELS.ZAPIER)} />
        </Flex>
      </Section>
    </Content>
  );
}

export default ChoseIntegration;
