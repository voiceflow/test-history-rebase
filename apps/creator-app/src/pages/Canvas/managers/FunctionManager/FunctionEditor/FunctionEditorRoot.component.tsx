import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Divider, Editor, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useNameNormalizer, usePathNormalizer } from '../FunctionManager.hook';
import { Description } from './components/Description.component';
import { EmptyFunction } from './components/EmptyFunction.component';
import { FunctionInputVariables } from './components/FunctionInputVariables.component';
import { FunctionOutputVariables } from './components/FunctionOutputVariables.component';
import { FunctionSelect } from './components/FunctionSelect.component';
import { editorStyles } from './Function.css';

export const FunctionEditorRoot: NodeEditorV2<Realtime.NodeData.Function> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Function>();
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionData = getItemFromMap(functionMap, editor.data.functionID);
  const hasFunctions = Object.values(functionMap).length > 0;

  const handleFunctionChange = (patchData: Partial<Realtime.NodeData.Function>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  usePathNormalizer(editor);
  useNameNormalizer(editor);

  return (
    <Editor
      title="Function"
      className={editorStyles}
      readOnly={true}
      headerActions={<SquareButton size="medium" iconName="More" onClick={() => null} />}
    >
      {hasFunctions ? (
        <>
          <FunctionSelect onChange={handleFunctionChange} functionID={functionData.id} />

          <Box pt={20}>
            <Divider noPadding={true} />
          </Box>

          <FunctionInputVariables onChange={handleFunctionChange} functionID={functionData.id} inputMapping={editor.data.inputMapping} />

          <FunctionOutputVariables onChange={handleFunctionChange} functionID={functionData.id} outputMapping={editor.data.outputMapping} />

          <Description description={functionData.description} />
        </>
      ) : (
        <EmptyFunction />
      )}
    </Editor>
  );
};
