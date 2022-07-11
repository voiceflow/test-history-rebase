import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useMapManager, useVariableCreation } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { mappingFactory } from '../../constants';
import * as APIEditorSectionStyles from '../styles';

const ParametersSection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const mapManager = useMapManager(editor.data.mapping ?? [], (mapping) => editor.onChange({ mapping }), {
    factory: mappingFactory,
  });
  const hasMappings = !!editor.data.mapping?.length;
  const { variables, createVariable } = useVariableCreation();

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={hasMappings}>Capture Response</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={!hasMappings}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((mapping, { index, onUpdate, onRemove }) => (
        <>
          {index > 0 && <APIEditorSectionStyles.IntegrationEditorSectionDivider />}
          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />} key={index}>
            <APIEditorSectionStyles.IntegrationEditorSectionItem>
              <VariablesInput placeholder="Enter key" value={mapping.path} onBlur={({ text }) => onUpdate({ path: text })} multiline />
              <VariableSelectV2
                options={variables}
                onCreate={createVariable}
                value={mapping.var}
                prefix="APPLY TO"
                onChange={(value) => onUpdate({ var: value })}
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
