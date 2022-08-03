import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { ChoseIntegration, GoogleSheets, ZapierEditor } from './components';

function IntegrationEditor({ data, onChange }) {
  const { selectedIntegration } = data;

  return !selectedIntegration ? (
    <ChoseIntegration onChange={onChange} />
  ) : (
    <>
      {selectedIntegration === BaseNode.Utils.IntegrationType.ZAPIER && <ZapierEditor onChange={onChange} data={data} />}
      {selectedIntegration === BaseNode.Utils.IntegrationType.GOOGLE_SHEETS && <GoogleSheets onChange={onChange} data={data} />}
    </>
  );
}

export default IntegrationEditor;
