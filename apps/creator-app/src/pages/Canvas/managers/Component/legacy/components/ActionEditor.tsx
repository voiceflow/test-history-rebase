import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import { ComponentEditorBase } from '../../ComponentEditor/ComponentEditorBase.component';
import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = (props) => {
  const { isEnabled: isCMSComponentsEnabled } = useFeature(Realtime.FeatureFlag.CMS_COMPONENTS);

  if (isCMSComponentsEnabled) {
    return <ComponentEditorBase />;
  }

  return <Form editor={props} header={<EditorV2.DefaultHeader onBack={props.goBack} />} footer={<Form.Footer editor={props} />} />;
};

export default Editor;
