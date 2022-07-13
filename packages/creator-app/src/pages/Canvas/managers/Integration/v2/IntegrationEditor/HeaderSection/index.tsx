import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { expressionFactory } from '../../constants';
import * as APIEditorSectionStyles from '../styles';

const HeaderSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const mapManager = useMapManager(editor.data.headers ?? [], (headers) => editor.onChange({ headers }), {
    factory: expressionFactory,
  });
  const hasHeaders = !!editor.data.headers?.length;

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={hasHeaders}>Headers</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={!hasHeaders}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((header, { index, onRemove, onUpdate }) => (
        <React.Fragment key={index}>
          {index > 0 && <APIEditorSectionStyles.IntegrationEditorSectionDivider />}

          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />} key={index}>
            <APIEditorSectionStyles.IntegrationEditorSectionItem>
              <VariablesInput placeholder="Enter parameter key" value={header.key} onBlur={({ text }) => onUpdate({ key: text })} multiline />
              <VariablesInput placeholder="Enter value or {variable}" value={header.val} onBlur={({ text }) => onUpdate({ val: text })} multiline />
            </APIEditorSectionStyles.IntegrationEditorSectionItem>
          </SectionV2.ListItem>
        </React.Fragment>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default HeaderSection;
