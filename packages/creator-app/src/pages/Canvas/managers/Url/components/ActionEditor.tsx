import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ACTIONS_BACKEND } from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = (props) => (
  <EditorV2 header={<EditorV2.DefaultHeader onBack={props.goBack} />} footer={<EditorV2.DefaultFooter tutorial={ACTIONS_BACKEND} />}>
    <Form editor={{ ...props, ...props.action }} />
  </EditorV2>
);

export default Editor;
