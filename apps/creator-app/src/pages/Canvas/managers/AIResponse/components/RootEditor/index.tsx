import { BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, toast, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Documentation from '@/config/documentation';
import { useFillVariables } from '@/hooks/variable';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import * as AI from '@/pages/Canvas/managers/components/AI';
import { copyWithToast } from '@/utils/clipboard';

import { useGenerativeFooterActions } from './hooks';
import { ResponsePreviewContainer } from './styles';

const PLACEHOLDERS = [
  'Greet {name} with a pun',
  'Provide 5 travel tips for {city}',
  'List all models of {car}',
  'Tell the user a joke using {name}',
  'Say {last_utterance} in {language}',
  'Make some small talk with {name}',
];

const Editor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts>();

  const actions = useGenerativeFooterActions(editor.onChange);
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
      const { output } = await client.testAPIClient.completion({ ...editor.data, ...context });
      if (!output) throw new Error();
      setPreview(output.trim());
    } catch {
      toast.error('Unable to generate response preview');
    } finally {
      setIsLoading(false);
    }
  };

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
                  <SvgIcon icon="aiSmall" />
                  Preview
                </Box.Flex>
              )}
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.Container>
        <SectionV2.Content topOffset={2.5} bottomOffset={3}>
          <AI.MemorySelect
            value={editor.data}
            onChange={editor.onChange}
            onContentChange={setHasContent}
            placeholder="Enter prompt, '{' variable"
            InputWrapper={{
              Component: Input.ScrollingPlaceholder,
              props: { placeholders: PLACEHOLDERS, hasContent },
            }}
          />
        </SectionV2.Content>
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

      <SectionV2.Divider />

      <AI.PromptSettingsEditor data={editor.data} onChange={editor.onChange} />
    </EditorV2>
  );
};

export default Editor;
