import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Divider, Editor } from '@voiceflow/ui-next';
import React from 'react';

import { Modals, useModal } from '@/ModalsV2';
import EditorV3 from '@/pages/Canvas/components/EditorV3';
import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useNameNormalizer, usePathNormalizer } from '../FunctionManager.hook';
import { Description } from './components/Description.component';
import { EmptyFunction } from './components/EmptyFunction.component';
import { FunctionInputVariables } from './components/FunctionInputVariables.component';
import { FunctionOutputVariables } from './components/FunctionOutputVariables.component';
import { FunctionSelect } from './components/FunctionSelect.component';
import { editorStyles, runButtonWrapper } from './Function.css';

export const FunctionEditorRoot: NodeEditorV2<Realtime.NodeData.Function> = () => {
  const editor = EditorV3.useEditor<Realtime.NodeData.Function>();
  const functionMap = React.useContext(FunctionMapContext)!;
  const { id, description } = getItemFromMap(functionMap, editor.data.functionID);
  const hasFunctions = Object.values(functionMap).length > 0;
  const testModal = useModal(Modals.Function.Test);

  const handleFunctionChange = (patchData: Partial<Realtime.NodeData.Function>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  usePathNormalizer(editor);
  useNameNormalizer(editor);

  return (
    <Editor title="Function" className={editorStyles} readOnly={true} headerActions={<EditorV3.HeaderActionsV3 />}>
      {hasFunctions ? (
        <>
          <FunctionSelect onChange={handleFunctionChange} functionID={id} />

          <Box pt={20}>
            <Divider noPadding />
          </Box>

          <FunctionInputVariables onChange={handleFunctionChange} functionID={id} inputMapping={editor.data.inputMapping} />

          <FunctionOutputVariables onChange={handleFunctionChange} functionID={id} outputMapping={editor.data.outputMapping} />

          <Description description={description} />

          <Box className={runButtonWrapper}>
            {id && <Button fullWidth size="large" variant="secondary" label="Run" onClick={() => testModal.open({ functionID: id })} />}
          </Box>
        </>
      ) : (
        <EmptyFunction />
      )}
    </Editor>
  );
};
