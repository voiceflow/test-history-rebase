import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { Modals, useModal } from '@/ModalsV2';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';

import { CollapsibleDescription } from '../../components/CollapsibleDescription.component';
import { EmptyFunction } from './components/EmptyFunction.component';
import { FunctionInputVariables } from './components/FunctionInputVariables.component';
import { FunctionOutputVariables } from './components/FunctionOutputVariables.component';
import { FunctionSelect } from './components/FunctionSelect.component';
import { stickyRunButtonWrapper } from './Function.css';

export const FunctionEditorRoot: React.FC = () => {
  const editor = useEditor<Realtime.NodeData.Function>();

  const { functionID } = editor.data;

  const functionDef = useSelector(Designer.Function.selectors.oneByID, { id: functionID });
  const hasFunctions = !!useSelector(Designer.Function.selectors.count);

  const testModal = useModal(Modals.Function.Test);

  const handleFunctionChange = (patchData: Partial<Realtime.NodeData.Function>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  useEffect(() => {
    editor.onChange({ ...editor.data, name: functionDef?.name });
  }, [functionID, functionDef?.name]);

  return (
    <Editor
      title="Function"
      readOnly
      headerActions={<EditorV3HeaderActions />}
      footer={
        functionID && (
          <Box className={stickyRunButtonWrapper}>
            <Button
              size="large"
              label="Run"
              variant="secondary"
              onClick={() => testModal.open({ functionID })}
              fullWidth
            />
          </Box>
        )
      }
    >
      <Scroll>
        <Box direction="column" width="100%" maxHeight="calc(100vh - 60px - 56px * 2)">
          {hasFunctions ? (
            <>
              <FunctionSelect onChange={handleFunctionChange} functionID={functionID} />

              <Box pt={20}>
                <Divider noPadding />
              </Box>

              <FunctionInputVariables
                onChange={handleFunctionChange}
                functionID={functionID}
                inputMapping={editor.data.inputMapping}
              />

              <FunctionOutputVariables
                onChange={handleFunctionChange}
                functionID={functionID}
                outputMapping={editor.data.outputMapping}
              />

              {!!functionDef?.description && <CollapsibleDescription value={functionDef?.description} readyOnly />}
            </>
          ) : (
            <EmptyFunction />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
