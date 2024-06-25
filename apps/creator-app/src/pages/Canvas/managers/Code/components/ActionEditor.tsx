import type * as Realtime from '@voiceflow/realtime-sdk';
import { System } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = (props) => (
  <EditorV2
    header={
      <Form.Header editor={props}>
        {!props.isFullscreen && (
          <System.IconButtonsGroup.Base mr={12}>
            <System.IconButton.Base icon="largeArrowLeft" onClick={() => props.goBack()} />
          </System.IconButtonsGroup.Base>
        )}
      </Form.Header>
    }
    footer={!props.isFullscreen && <EditorV2.DefaultFooter tutorial={Documentation.ACTIONS_BACKEND} />}
    fillHeight
    withoutContentContainer
  >
    <Form {...props} />
  </EditorV2>
);

export default Editor;
