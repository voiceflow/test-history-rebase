import { Node } from '@voiceflow/base-types';
import React from 'react';

import { ChoseIntegration, CustomApi, GoogleSheets, ZapierEditor } from './components';

function IntegrationEditor({ data, onChange }) {
  const { selectedIntegration } = data;

  return !selectedIntegration ? (
    <ChoseIntegration onChange={onChange} />
  ) : (
    <>
      {selectedIntegration === Node.Utils.IntegrationType.ZAPIER && <ZapierEditor onChange={onChange} data={data} />}
      {selectedIntegration === Node.Utils.IntegrationType.CUSTOM_API && <CustomApi onChange={onChange} data={data} />}
      {selectedIntegration === Node.Utils.IntegrationType.GOOGLE_SHEETS && <GoogleSheets onChange={onChange} data={data} />}
    </>
  );
}

export default IntegrationEditor;
