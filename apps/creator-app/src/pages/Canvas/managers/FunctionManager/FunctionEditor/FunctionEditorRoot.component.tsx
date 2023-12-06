import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { FunctionMapContext } from '@/pages/Canvas/contexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useNameNormalizer, usePathNormalizer } from '../FunctionManager.hook';
import { FunctionInputVariables } from './components/FunctionInputVariables.component';
import { FunctionOutputVariables } from './components/FunctionOutputVariables.component';
import { FunctionSelect } from './components/FunctionSelect.component';

export const FunctionEditorRoot: NodeEditorV2<Realtime.NodeData.Function> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Function>();
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionData = getItemFromMap(functionMap, editor.data.functionID);

  const handleFunctionChange = (patchData: Partial<Realtime.NodeData.Function>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  usePathNormalizer(editor);
  useNameNormalizer(editor);

  return (
    <EditorV2 header={<EditorV2.DefaultHeader />}>
      <FunctionSelect onChange={handleFunctionChange} functionID={functionData.id} />

      <SectionV2.Divider />

      <FunctionInputVariables onChange={handleFunctionChange} functionID={functionData.id} inputMapping={editor.data.inputMapping} />

      <SectionV2.Divider />

      <FunctionOutputVariables onChange={handleFunctionChange} functionID={functionData.id} outputMapping={editor.data.outputMapping} />
    </EditorV2>
  );
};
