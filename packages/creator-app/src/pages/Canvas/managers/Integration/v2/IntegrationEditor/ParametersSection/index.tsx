import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useManager, useVariableCreation } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { expressionFactory } from '../../constants';
import * as APIEditorSectionStyles from '../styles';

const ParametersSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const { onAdd, mapManaged } = useManager(editor.data.parameters ?? [], (parameters) => editor.onChange({ parameters }), {
    factory: expressionFactory,
  });
  const hasParams = !!editor.data.parameters?.length;
  const { variables, createVariable } = useVariableCreation();

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={hasParams}>Parameters</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={onAdd} />}
      collapsed={!hasParams}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManaged((parameter, { index, onUpdate, onRemove }) => (
        <>
          {index > 0 && <APIEditorSectionStyles.IntegrationEditorSectionDivider />}
          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />} key={index}>
            <APIEditorSectionStyles.IntegrationEditorSectionItem>
              <VariablesInput placeholder="Enter parameter key" value={parameter.key} onBlur={({ text }) => onUpdate({ key: text })} multiline />
              <VariableSelectV2
                options={variables}
                onCreate={createVariable}
                value={parameter.val}
                prefix="APPLY TO"
                onChange={(value) => onUpdate({ val: value })}
                placeholder="Select variable"
              />
            </APIEditorSectionStyles.IntegrationEditorSectionItem>
          </SectionV2.ListItem>
        </>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default ParametersSection;
