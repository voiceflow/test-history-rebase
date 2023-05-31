import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import * as CustomBlock from '@/ducks/customBlock';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import MissingText from './MissingText';

const useHeaderActions = (customBlock: Realtime.CustomBlock | null) => {
  const editorDefaultActions = EditorV2.useEditorDefaultActions();
  const customBlocksEditorModal = ModalsV2.useModal(ModalsV2.Canvas.CustomBlocksEditor.EditModal);

  if (!customBlock) return editorDefaultActions;

  const editSourceAction = {
    label: 'Edit source',
    onClick: () => customBlocksEditorModal.openVoid({ blockID: customBlock.id }),
  };

  return [...editorDefaultActions, editSourceAction];
};

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Pointer>();

  const { pointerName, parameters, sourceID } = editor.data;

  const customBlock = useSelector(CustomBlock.customBlockByIDSelector, { id: sourceID });

  const headerActions = useHeaderActions(customBlock);

  const validParameters = React.useMemo(
    () => Object.fromEntries(customBlock?.parameters.map((paramName) => [paramName, parameters[paramName] ?? '']) ?? []),
    [customBlock, parameters]
  );

  const onChange = (varname: string, val: string) =>
    editor.engine.node.updateData(editor.nodeID, {
      parameters: { ...validParameters, [varname]: val },
    });

  if (!customBlock) {
    return (
      <EditorV2 header={<EditorV2.DefaultHeader title={pointerName} />}>
        <SectionV2.Content style={{ marginTop: '20px', paddingBottom: '0px' }}>
          <MissingText />
        </SectionV2.Content>
      </EditorV2>
    );
  }

  return (
    <EditorV2 header={<EditorV2.DefaultHeader title={customBlock.name} actions={headerActions} />}>
      {Object.keys(validParameters).map((paramName, index) => (
        <React.Fragment key={paramName}>
          <SectionV2.Header bottomUnit={1.375} topUnit={index === 0 ? 2.5 : 0}>
            <SectionV2.Title bold secondary>
              {paramName}
            </SectionV2.Title>
          </SectionV2.Header>

          <SectionV2.Content bottomOffset={3}>
            <VariablesInput
              value={validParameters[paramName] ?? ''}
              onBlur={({ text }) => onChange(paramName, text)}
              fullWidth
              multiline
              placeholder="Add value or {variable}"
            />
          </SectionV2.Content>
        </React.Fragment>
      ))}
    </EditorV2>
  );
};

export default RootEditor;
