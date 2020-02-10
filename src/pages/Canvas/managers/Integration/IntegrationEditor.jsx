import React from 'react';

import { IntegrationType } from '@/constants';

import { ChoseIntegration, CustomApi, GoogleSheets, ZapierEditor } from './components';

function IntegrationEditor({ data, onChange }) {
  const { selectedIntegration } = data;

  return !selectedIntegration ? (
    <ChoseIntegration onChange={onChange} />
  ) : (
    <>
      {selectedIntegration === IntegrationType.ZAPIER && <ZapierEditor onChange={onChange} data={data} />}
      {selectedIntegration === IntegrationType.CUSTOM_API && <CustomApi onChange={onChange} data={data} />}
      {selectedIntegration === IntegrationType.GOOGLE_SHEETS && <GoogleSheets onChange={onChange} data={data} />}
    </>
  );
}

export default IntegrationEditor;
