import { ResponseType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Editor, Scroll } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { ResponseMessageForm } from '@/components/ResponseV2/ResponseMessageForm/ResponseMessageForm.component';
import { useResponseMessageEditForm } from '@/components/ResponseV2/ResponseMessageForm/ResponseMessageForm.hook';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { editorStyles } from './MessageEditor.css';

export const MessageEditorRoot: NodeEditorV2<Realtime.NodeData.Response> = () => {
  const editor = useEditor<Realtime.NodeData.Response>();
  const { responseID } = editor.data;
  const createResponse = useDispatch(Designer.Response.effect.createOne);

  const handleResponseChange = (patchData: Partial<Realtime.NodeData.Response>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  const editForm = useResponseMessageEditForm({ responseID, onChangeResponse: handleResponseChange });

  useEffect(() => {
    if (!responseID) {
      createResponse({
        messages: [
          {
            condition: null,
            delay: null,
            text: [''],
          },
        ],
        folderID: null,
        variants: [],
        name: '',
        type: ResponseType.EMPTY,
      })
        .then(({ id }) => handleResponseChange({ responseID: id, responseType: ResponseType.EMPTY }))
        .catch(() => {
          // do nothing
        });
    }
  }, []);

  return (
    <Editor title="Message" readOnly className={editorStyles} headerActions={<EditorV3HeaderActions />}>
      <Scroll>
        {/* TODO: we need to fix on paste propagation for editor sidebar v3 component */}
        <Box
          direction="column"
          width="100%"
          maxHeight="calc(100vh - 60px - 56px * 2)"
          onPaste={stopImmediatePropagation()}
        >
          <ResponseMessageForm {...editForm} />
        </Box>
      </Scroll>
    </Editor>
  );
};
