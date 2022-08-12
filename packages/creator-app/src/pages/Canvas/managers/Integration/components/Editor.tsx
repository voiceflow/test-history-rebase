import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import APIForm from './APIForm';
import { isCustomAPIEditor } from './utils';
import ZapierAndGoogleEditor from './ZapierAndGoogleEditor';

const IntegrationEditorV2: NodeEditorV2<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  if (isCustomAPIEditor(props))
    return (
      <APIForm
        header={<EditorV2.DefaultHeader onBack={props.goBack} />}
        editor={props}
        footer={<APIForm.Footer tutorial={Documentation.ACTIONS_BACKEND} />}
      />
    );

  return <ZapierAndGoogleEditor {...props} />;
};

export default IntegrationEditorV2;
