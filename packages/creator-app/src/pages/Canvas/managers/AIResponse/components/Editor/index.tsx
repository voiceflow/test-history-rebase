import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, System, toast, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useGenOptions } from '@/components/GPT/hooks';
import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import { useFillVariables } from '@/ModalsV2/modals/VariablePrompt';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import PromptSettings from '@/pages/Canvas/managers/AISet/components/Editor/components/PromptSettings';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { copyWithToast } from '@/utils/clipboard';

import { useGenerativeFooterActions } from './actions';
import { ResponsePreviewContainer } from './styles';

const PLACEHOLDERS = [
  'Greet {name} with a pun',
  'Provide 5 travel tips for {city}',
  'List all models of {car}',
  'Tell the user a joke using {name}',
  'Say {last_utterance} in {language}',
  'Make some small talk with {name}',
];

const Editor: NodeEditorV2<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts> = ({ data, onChange }) => {
  const fillVariables = useFillVariables();
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(false);

  const actions = useGenerativeFooterActions(onChange);

  const [preview, setPreview] = useSessionStorageState<string | null>(`${data.nodeID}_preview`, null);

  const getGenOptions = useGenOptions();

  const onPreview = async () => {
    if (isLoading) return;

    const context = await fillVariables({ prompt: data.prompt, system: data.system });
    if (!context) return;

    try {
      setIsLoading(true);
      const { result } = await client.gptGen.generativeResponse({ ...data, ...getGenOptions(), ...context });
      setPreview(result.trim());
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
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleContentSection
        header={
          <Box.Flex width="100%">
            <SectionV2.Title bold secondary>
              Prompt
            </SectionV2.Title>

            <System.Link.Anchor fontSize={13} href={Documentation.AI_RESPONSE_STEP}>
              See examples
            </System.Link.Anchor>
          </Box.Flex>
        }
        headerProps={{ topUnit: 2.5, bottomUnit: 1.375 }}
        contentProps={{ bottomOffset: 3 }}
      >
        <Input.ScrollingPlaceholder placeholders={PLACEHOLDERS} hasContent={hasContent}>
          <VariablesInput
            value={data.prompt}
            onBlur={({ text }) => onChange({ prompt: text })}
            multiline
            placeholder="Enter prompt, '{' variable"
            newLineOnEnter
            onEditorStateChange={(state) => setHasContent(state.getCurrentContent().hasText())}
          />
        </Input.ScrollingPlaceholder>
      </SectionV2.SimpleContentSection>

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
      <PromptSettings data={data} onChange={onChange} />
    </EditorV2>
  );
};

export default Editor;
