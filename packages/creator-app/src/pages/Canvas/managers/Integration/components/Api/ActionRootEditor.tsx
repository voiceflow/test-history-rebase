import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Actions } from '@/pages/Canvas/managers/components';

import Form from './Form';

const ActionRootEditor: React.FC = () => {
  const editor = Actions.Editor.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>();

  return (
    <Form
      editor={editor}
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={<Form.Footer tutorial={Documentation.ACTIONS_BACKEND} editor={editor} />}
    />
  );
};

export default ActionRootEditor;
