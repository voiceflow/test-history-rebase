import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ACTIONS_NAVIGATION } from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.GoToIntent> = (props) => (
  <EditorV2 header={<EditorV2.DefaultHeader onBack={props.goBack} />} footer={<EditorV2.DefaultFooter tutorial={ACTIONS_NAVIGATION} />}>
    <Form editor={{ ...props, ...props.action }} />
  </EditorV2>
);

export default Editor;
