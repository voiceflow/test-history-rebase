import { BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, toast, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import { useFillVariables } from '@/hooks/variable';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import * as AI from '@/pages/Canvas/managers/components/AI';
import { copyWithToast } from '@/utils/clipboard';

import { MEMORY_SELECT_OPTIONS, PLACEHOLDERS } from './constants';
import { useGenerativeFooterActions } from './hooks';
import { ResponsePreviewContainer } from './styles';

const Editor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts>();
  const { source = BaseUtils.ai.DATA_SOURCE.DEFAULT } = editor.data;

  const actions = useGenerativeFooterActions(editor.onChange);
  const getCompletion = AI.useSourceCompletion();
  const fillVariables = useFillVariables();

  const [preview, setPreview] = useSessionStorageState<string | null>(`${editor.data.nodeID}_preview`, null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(false);

  const onPreview = async () => {
    if (isLoading) return;

    const context = await fillVariables({ prompt: editor.data.prompt, system: editor.data.system });
    if (!context) return;

    try {
      setIsLoading(true);
      const output = await getCompletion(source, { ...context, mode: BaseUtils.ai.PROMPT_MODE.PROMPT });
      if (output) {
        setPreview(output.trim());
      } else {
        toast.error('Unable to complete prompt');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const knowledgeBase = useKnowledgeBase();
  const isKnowledgeBaseSource = source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.AI_RESPONSE_STEP}>
          {!!actions.length && <EditorV2.FooterActionsButton actions={actions} />}

          {editor.data.mode !== BaseUtils.ai.PROMPT_MODE.MEMORY && (
            <Button variant={Button.Variant.PRIMARY} disabled={!hasContent || isLoading} onClick={onPreview} width={127}>
              {isLoading ? (
                <SvgIcon icon="arrowSpin" spin />
              ) : (
                <Box.Flex gap={12}>
                  <SvgIcon icon={isKnowledgeBaseSource ? 'brain' : 'aiSmall'} />
                  Preview
                </Box.Flex>
              )}
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
    >
      {knowledgeBase && (
        <>
          <SectionV2.SimpleContentSection
            header={
              <SectionV2.Title bold secondary>
                Data Source
              </SectionV2.Title>
            }
            headerProps={{ bottomUnit: 1.5 }}
            contentProps={{ bottomOffset: 2.5 }}
          >
            <RadioGroup isFlat options={AI.SOURCE_OPTIONS} checked={source} onChange={(source) => editor.onChange({ source })} />
          </SectionV2.SimpleContentSection>

          <SectionV2.Divider inset />
        </>
      )}

      <SectionV2.Container>
        {isKnowledgeBaseSource ? (
          <SectionV2.Content topOffset={3} bottomOffset={3}>
            <AI.PromptInput
              value={editor.data}
              onChange={editor.onChange}
              onContentChange={setHasContent}
              placeholder="Enter user question, '{' variable"
            />
          </SectionV2.Content>
        ) : (
          <SectionV2.Content topOffset={2.5} bottomOffset={3}>
            <AI.MemorySelect
              value={editor.data}
              onChange={editor.onChange}
              onContentChange={setHasContent}
              options={MEMORY_SELECT_OPTIONS}
              placeholder="Enter prompt, '{' variable"
              InputWrapper={{
                Component: Input.ScrollingPlaceholder,
                props: { placeholders: PLACEHOLDERS, hasContent },
              }}
            />
          </SectionV2.Content>
        )}
      </SectionV2.Container>

      {!!preview && (
        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Response Preview
            </SectionV2.Title>
          }
          headerProps={{ bottomUnit: 1.375, topUnit: 0 }}
          contentProps={{ bottomOffset: 3 }}
        >
          <ResponsePreviewContainer>
            <SvgIcon icon="copy" variant={SvgIcon.Variant.STANDARD} clickable onClick={copyWithToast(preview)} />
            {preview}
          </ResponsePreviewContainer>
        </SectionV2.SimpleContentSection>
      )}

      <AI.PromptSettingsEditor data={editor.data} onChange={editor.onChange} />
    </EditorV2>
  );
};

export default Editor;
