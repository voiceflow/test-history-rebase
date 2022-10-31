import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = (props) => (
  <Form
    editor={props}
    header={
      <Form.Header editor={props}>
        {!props.isFullscreen && (
          <SectionV2.ActionsContainer isLeft unit={0} offsetUnit={2.75}>
            <IconButton icon="largeArrowLeft" onClick={() => props.goBack()} variant={IconButton.Variant.BASIC} />
          </SectionV2.ActionsContainer>
        )}
      </Form.Header>
    }
    footer={!props.isFullscreen && <EditorV2.DefaultFooter tutorial={Documentation.ACTIONS_BACKEND} />}
  />
);

export default Editor;
