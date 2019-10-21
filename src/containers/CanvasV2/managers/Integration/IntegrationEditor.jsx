import React from 'react';

import Flex from '@/componentsV2/Flex';
import { INTEGRATION_DATA_MODELS } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';

import Editor from './components/Editor';
import IntegrationOption from './components/IntegrationOption';

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

function IntegrationEditor({ data, onChange }) {
  const updateSelected = (targetIntegration) => {
    if (targetIntegration === data.selectedIntegration) return;
    switch (targetIntegration) {
      case INTEGRATION_OPTIONS.CUSTOM_API.type:
        onChange(INTEGRATION_DATA_MODELS.CUSTOM_API);
        break;
      case INTEGRATION_OPTIONS.GOOGLE_SHEETS.type:
        onChange(INTEGRATION_DATA_MODELS.GOOGLE_SHEETS);
        break;
      case INTEGRATION_OPTIONS.ZAPIER.type:
        onChange(INTEGRATION_DATA_MODELS.ZAPIER);
        break;
      default:
        break;
    }
  };

  const { selectedIntegration } = data;

  return (
    <Content>
      {selectedIntegration ? (
        <Editor onChange={onChange} data={data} type={selectedIntegration} changeIntegration={() => onChange({ selectedIntegration: null })} />
      ) : (
        <Section>
          <div className="mb-4 text-center">Choose an integration</div>
          <Flex className="mb-0">
            <IntegrationOption data={INTEGRATION_OPTIONS.CUSTOM_API} onClick={updateSelected} />
          </Flex>
          <Flex>
            <IntegrationOption data={INTEGRATION_OPTIONS.GOOGLE_SHEETS} onClick={updateSelected} />
            <IntegrationOption data={INTEGRATION_OPTIONS.ZAPIER} onClick={updateSelected} />
          </Flex>
        </Section>
      )}
    </Content>
  );
}

export default IntegrationEditor;
