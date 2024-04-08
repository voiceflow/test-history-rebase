import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Button, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modals, useModal } from '@/ModalsV2';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useNameNormalizer } from '../FunctionManager.hook';
import { Description } from './components/Description.component';
import { EmptyFunction } from './components/EmptyFunction.component';
import { FunctionInputVariables } from './components/FunctionInputVariables.component';
import { FunctionOutputVariables } from './components/FunctionOutputVariables.component';
import { FunctionSelect } from './components/FunctionSelect.component';
import { editorStyles, stickyRunButtonWrapper } from './Function.css';

export const FunctionEditorRoot: NodeEditorV2<Realtime.NodeData.Function> = () => {
  const editor = useEditor<Realtime.NodeData.Function>();
  const functionMap = React.useContext(FunctionMapContext)!;
  const { id, description } = getItemFromMap(functionMap, editor.data.functionID);
  const hasFunctions = Object.values(functionMap).length > 0;
  const testModal = useModal(Modals.Function.Test);

  const handleFunctionChange = (patchData: Partial<Realtime.NodeData.Function>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  useNameNormalizer(editor);

  return (
    <Editor
      title="Function"
      readOnly
      className={editorStyles}
      headerActions={<EditorV3HeaderActions />}
      footer={
        editor.data.functionID && (
          <Box className={stickyRunButtonWrapper}>
            <Button fullWidth size="large" variant="secondary" label="Run" onClick={() => testModal.open({ functionID: id! })} />
          </Box>
        )
      }
    >
      <Scroll>
        {/* TODO: we need to fix on paste propagation for editor sidebar v3 component */}
        <Box direction="column" width="100%" maxHeight="calc(100vh - 60px - 56px * 2)" onPaste={stopImmediatePropagation()}>
          {hasFunctions ? (
            <>
              <FunctionSelect onChange={handleFunctionChange} functionID={id} />

              <Box pt={20}>
                <Divider noPadding />
              </Box>

              <FunctionInputVariables onChange={handleFunctionChange} functionID={id} inputMapping={editor.data.inputMapping} />

              <FunctionOutputVariables onChange={handleFunctionChange} functionID={id} outputMapping={editor.data.outputMapping} />

              <Description description={description} />
            </>
          ) : (
            <EmptyFunction />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
