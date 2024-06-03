import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { ResponseEditForm } from '@/components/Response/ResponseEditForm/ResponseEditForm.component';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { ResponseMapFirstVariantByResponseIDContext } from '@/pages/Canvas/contexts/ReduxContexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { ResponseCreateForm } from './ResponseCreateForm/ResponseCreateForm.component';
import { editorStyles } from './ResponseEditor.css';

export const ResponseEditorRoot: NodeEditorV2<Realtime.NodeData.Response> = () => {
  const editor = useEditor<Realtime.NodeData.Response>();
  const { responseID } = editor.data;
  const responseMapFirstVariantByResponseID = React.useContext(ResponseMapFirstVariantByResponseIDContext)!;
  const variant = responseID ? responseMapFirstVariantByResponseID[responseID] : null;

  const handleResponseChange = (patchData: Partial<Realtime.NodeData.Response>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

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
          {responseID && variant ? (
            <ResponseEditForm responseID={responseID} />
          ) : (
            <ResponseCreateForm onResponseCreate={(id) => handleResponseChange({ responseID: id })} />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
