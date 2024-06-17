import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Editor, Scroll } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { ResponseEditForm } from '@/components/Response/ResponseEditForm/ResponseEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { DEFAULT_MESSAGE } from '@/pages/AssistantCMS/pages/CMSMessage/CMSMessage.hook';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { editorStyles } from './MessageEditor.css';

export const MessageEditorRoot: NodeEditorV2<Realtime.NodeData.Response> = () => {
  const editor = useEditor<Realtime.NodeData.Response>();
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const { responseID } = editor.data;

  const handleResponseChange = (patchData: Partial<Realtime.NodeData.Response>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  useEffect(() => {
    if (!responseID) {
      createResponse({
        messages: DEFAULT_MESSAGE,
        folderID: null,
        variants: [],
        name: '',
      })
        .then(({ id }) => handleResponseChange({ responseID: id }))
        .catch(() => {
          // do nothing
        });
    }
  }, []);

  return (
    <Editor title="Agent" readOnly className={editorStyles} headerActions={<EditorV3HeaderActions />}>
      <Scroll>
        {/* TODO: we need to fix on paste propagation for editor sidebar v3 component */}
        <Box
          direction="column"
          width="100%"
          maxHeight="calc(100vh - 60px - 56px * 2)"
          onPaste={stopImmediatePropagation()}
        >
          {responseID && <ResponseEditForm responseID={responseID} />}
        </Box>
      </Scroll>
    </Editor>
  );
};
