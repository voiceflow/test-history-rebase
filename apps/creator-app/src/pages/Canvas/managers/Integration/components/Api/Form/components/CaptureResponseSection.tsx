import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';
import { useVariableCreateModal } from '@/hooks/modal.hook';

import { mappingFactory } from '../constants';
import { BaseFormProps } from '../types';
import * as S from './styles';

const ParametersSection: React.FC<BaseFormProps> = ({ editor }) => {
  const variableCreateModal = useVariableCreateModal();

  const createVariable = async (name: string): Promise<string> => {
    const variable = await variableCreateModal.open({ name, folderID: null });

    return variable.id;
  };

  const mapManager = useMapManager(editor.data.mapping ?? [], (mapping) => editor.onChange({ mapping }), {
    factory: mappingFactory,
  });

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!mapManager.isEmpty}>Capture Response</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={mapManager.isEmpty}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((mapping, { key, isFirst, onUpdate, onRemove }) => (
        <React.Fragment key={key}>
          {!isFirst && <S.Divider />}

          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
            <S.Item>
              <VariablesInput placeholder="Enter key" value={mapping.path} onBlur={({ text }) => onUpdate({ path: text })} multiline />

              <VariableSelectV2
                value={mapping.var}
                prefix="APPLY TO"
                onCreate={createVariable}
                onChange={(value) => onUpdate({ var: value })}
                placeholder="Select variable"
              />
            </S.Item>
          </SectionV2.ListItem>
        </React.Fragment>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default ParametersSection;
