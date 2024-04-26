import { BaseNode } from '@voiceflow/base-types';
import { Box, SectionV2, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2 } from '@/components/AceEditor';
import RadioGroup from '@/components/RadioGroup';
import VariablesInput from '@/components/VariablesInput';
import { useMapManager } from '@/hooks';

import { BODY_OPTIONS, expressionFactory } from '../constants';
import type { BaseFormProps } from '../types';
import * as S from './styles';

const BodySection: React.FC<BaseFormProps> = ({ editor }) => {
  const { body, content, bodyInputType } = editor.data;

  const [aceContent, setAceContent] = useLinkedState(content);

  const mapManager = useMapManager(body ?? [], (body) => editor.onChange({ body }), {
    factory: expressionFactory,
  });

  const bodyData =
    bodyInputType === BaseNode.Api.APIBodyType.FORM_DATA || bodyInputType === BaseNode.Api.APIBodyType.URL_ENCODED;

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!mapManager.isEmpty}>Body</SectionV2.Title>}
      action={
        mapManager.isEmpty || bodyData ? (
          <SectionV2.AddButton onClick={() => mapManager.onAdd()} />
        ) : (
          <SectionV2.RemoveButton onClick={() => editor.onChange({ body: undefined })} />
        )
      }
      collapsed={mapManager.isEmpty}
      contentProps={{ paddingBottom: '24px' }}
    >
      <Box mb="20px">
        <RadioGroup
          options={BODY_OPTIONS}
          checked={bodyInputType}
          onChange={(bodyInputType) => editor.onChange({ bodyInputType })}
        />
      </Box>

      {bodyData && (
        <Box>
          {mapManager.map((body, { key, isFirst, onUpdate, onRemove }) => (
            <React.Fragment key={key}>
              {!isFirst && <S.Divider />}

              <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
                <S.Item>
                  <VariablesInput
                    placeholder="Enter key"
                    value={body.key}
                    onBlur={({ text }) => onUpdate({ key: text })}
                    multiline
                  />

                  <VariablesInput
                    placeholder="Enter value or {variable}"
                    value={body.val}
                    onBlur={({ text }) => onUpdate({ val: text })}
                    multiline
                  />
                </S.Item>
              </SectionV2.ListItem>
            </React.Fragment>
          ))}
        </Box>
      )}

      {bodyInputType === BaseNode.Api.APIBodyType.RAW_INPUT && (
        <Box height="245px">
          <AceEditor
            placeholder="Enter Body Content"
            value={aceContent}
            onChange={setAceContent}
            onBlur={() => editor.onChange({ content: aceContent })}
            mode="javascript"
            name="code"
            hasBorder
            setOptions={ACE_EDITOR_OPTIONS_V2}
            editorColors={ACE_EDITOR_COLORS}
            fullHeight
            editorSpacing
            scrollMargin={[12, 12, 0, 0]}
          />
        </Box>
      )}
    </SectionV2.ActionCollapseSection>
  );
};

export default BodySection;
