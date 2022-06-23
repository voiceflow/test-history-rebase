import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2 } from '@/components/AceEditor';
import RadioGroup from '@/components/RadioGroup';
import VariablesInput from '@/components/VariablesInput';
import { useManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { expressionFactory } from '../../constants';
import { BODY_OPTIONS } from '../constants';
import * as APIEditorSectionStyles from '../styles';

const BodySection: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const [bodyInputType, setBodyInputType] = React.useState<BaseNode.Api.APIBodyType | undefined>(editor.data.bodyInputType);
  const { onAdd, mapManaged } = useManager(editor.data.body ?? [], (body) => editor.onChange({ body }), {
    factory: expressionFactory,
  });
  const bodyData = bodyInputType === BaseNode.Api.APIBodyType.FORM_DATA || bodyInputType === BaseNode.Api.APIBodyType.URL_ENCODED;
  const hasBody = !!editor.data.body?.length;
  const [aceContent, setAceContent] = React.useState(editor.data.content);

  const onChangeBodyType = (bodyInputType: BaseNode.Api.APIBodyType) => {
    editor.onChange({ bodyInputType });
    setBodyInputType(bodyInputType);
  };

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={hasBody}>Body</SectionV2.Title>}
      action={
        !hasBody || bodyData ? (
          <SectionV2.AddButton onClick={onAdd} />
        ) : (
          <SectionV2.RemoveButton onClick={() => editor.onChange({ body: undefined })} />
        )
      }
      collapsed={!hasBody}
      contentProps={{ paddingBottom: '24px' }}
    >
      <Box mb="20px">
        <RadioGroup options={BODY_OPTIONS} checked={bodyInputType} onChange={onChangeBodyType} />
      </Box>

      {bodyData && (
        <Box>
          {mapManaged((body, { index, onUpdate, onRemove }) => (
            <>
              {index > 0 && <APIEditorSectionStyles.IntegrationEditorSectionDivider />}
              <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />} key={index}>
                <APIEditorSectionStyles.IntegrationEditorSectionItem>
                  <VariablesInput placeholder="Enter key" value={body.key} onBlur={({ text }) => onUpdate({ key: text })} multiline />
                  <VariablesInput placeholder="Enter value or {variable}" value={body.val} onBlur={({ text }) => onUpdate({ val: text })} multiline />
                </APIEditorSectionStyles.IntegrationEditorSectionItem>
              </SectionV2.ListItem>
            </>
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
