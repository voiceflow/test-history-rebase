import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.GoToNode> = (props) => (
  <Form
    editor={props}
    header={<EditorV2.DefaultHeader onBack={props.goBack} />}
    footer={<EditorV2.DefaultFooter tutorial={Documentation.ACTIONS_NAVIGATION} />}
  />
);

export default Editor;
