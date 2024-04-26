import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';

import { expressionFactory } from '../constants';
import type { BaseFormProps } from '../types';
import * as S from './styles';

const ParametersSection: React.FC<BaseFormProps> = ({ editor }) => {
  const mapManager = useMapManager(editor.data.parameters ?? [], (parameters) => editor.onChange({ parameters }), {
    factory: expressionFactory,
  });

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!mapManager.isEmpty}>Parameters</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={mapManager.isEmpty}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((parameter, { key, isFirst, onUpdate, onRemove }) => (
        <React.Fragment key={key}>
          {!isFirst && <S.Divider />}

          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
            <S.Item>
              <VariablesInput
                placeholder="Enter parameter key"
                value={parameter.key}
                onBlur={({ text }) => onUpdate({ key: text })}
                multiline
              />

              <VariablesInput
                value={parameter.val}
                onBlur={({ text }) => onUpdate({ val: text })}
                multiline
                placeholder="Enter value or {variable}"
              />
            </S.Item>
          </SectionV2.ListItem>
        </React.Fragment>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default ParametersSection;
