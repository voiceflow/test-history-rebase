import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { expressionFactory } from '../../constants';
import * as S from '../styles';

const ParametersSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const mapManager = useMapManager(editor.data.parameters ?? [], (parameters) => editor.onChange({ parameters }), {
    factory: expressionFactory,
  });
  const hasParams = !!editor.data.parameters?.length;

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={hasParams}>Parameters</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={!hasParams}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((parameter, { key, index, onUpdate, onRemove }) => (
        <React.Fragment key={key}>
          {index > 0 && <S.IntegrationEditorSectionDivider />}

          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />} key={index}>
            <S.IntegrationEditorSectionItem>
              <VariablesInput placeholder="Enter parameter key" value={parameter.key} onBlur={({ text }) => onUpdate({ key: text })} multiline />

              <VariablesInput
                value={parameter.val}
                onBlur={({ text }) => onUpdate({ val: text })}
                multiline
                placeholder="Enter value or {variable}"
              />
            </S.IntegrationEditorSectionItem>
          </SectionV2.ListItem>
        </React.Fragment>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default ParametersSection;
