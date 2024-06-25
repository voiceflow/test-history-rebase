import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';

import { expressionFactory } from '../constants';
import type { BaseFormProps } from '../types';
import * as APIEditorSectionStyles from './styles';

const HeaderSection: React.FC<BaseFormProps> = ({ editor }) => {
  const mapManager = useMapManager(editor.data.headers ?? [], (headers) => editor.onChange({ headers }), {
    factory: expressionFactory,
  });

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!mapManager.isEmpty}>Headers</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      collapsed={mapManager.isEmpty}
      contentProps={{ bottomOffset: 3 }}
    >
      {mapManager.map((header, { key, isFirst, onRemove, onUpdate }) => (
        <React.Fragment key={key}>
          {!isFirst && <APIEditorSectionStyles.Divider />}

          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
            <APIEditorSectionStyles.Item>
              <VariablesInput
                placeholder="Enter parameter key"
                value={header.key}
                onBlur={({ text }) => onUpdate({ key: text })}
                multiline
              />

              <VariablesInput
                placeholder="Enter value or {variable}"
                value={header.val}
                onBlur={({ text }) => onUpdate({ val: text })}
                multiline
              />
            </APIEditorSectionStyles.Item>
          </SectionV2.ListItem>
        </React.Fragment>
      ))}
    </SectionV2.ActionCollapseSection>
  );
};

export default HeaderSection;
