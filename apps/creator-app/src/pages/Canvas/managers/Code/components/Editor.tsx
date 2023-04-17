import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: NodeEditorV2<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = (props) => {
  const editorActions = EditorV2.useEditorDefaultActions();

  return (
    <Form
      editor={props}
      footer={
        !props.isFullscreen && (
          <EditorV2.DefaultFooter tutorial={Documentation.CODE_STEP}>
            <EditorV2.FooterActionsButton actions={editorActions} />
          </EditorV2.DefaultFooter>
        )
      }
    />
  );
};

export default Editor;
