import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import APIForm from './APIForm';
import { isCustomAPIEditor } from './utils';
import ZapierAndGoogleEditor from './ZapierAndGoogleEditor';

const IntegrationActionEditor: ActionEditor<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  const data = { ...props, ...props.action };

  if (isCustomAPIEditor(data)) {
    return (
      <APIForm
        editor={data}
        header={<EditorV2.DefaultHeader onBack={props.goBack} />}
        footer={<APIForm.Footer tutorial={Documentation.ACTIONS_BACKEND} editor={data} />}
      />
    );
  }

  return <ZapierAndGoogleEditor {...data} />;
};

export default IntegrationActionEditor;
