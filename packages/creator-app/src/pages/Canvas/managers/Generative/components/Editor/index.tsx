import { SLOT_REGEXP } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Link, SectionV2, SvgIcon, toast, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useGenOptions } from '@/components/GPT/hooks';
import VariablesInput from '@/components/VariablesInput';
import * as ModalsV2 from '@/ModalsV2';
import { deepVariableReplacement, deepVariableSearch } from '@/ModalsV2/modals/Canvas/Integration/SendRequest/utils';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import { copyWithToast } from '@/utils/clipboard';

import { useGenerativeFooterActions } from './actions';
import ScrollingPlaceholder from './ScrollingPlaceholder';
import { ResponsePreviewContainer } from './styles';

const PLACEHOLDERS = [
  'Greet {name} with a pun',
  'Provide 5 travel tips for {city}',
  'List all models of {car}',
  'Tell the user a joke using {name}',
  'Say {last_utterance} in {language}',
  'Make some small talk with {name}',
];

const Editor: NodeEditorV2<Realtime.NodeData.Generative, Realtime.NodeData.GenerativeBuiltInPorts> = ({ data, onChange }) => {
  const variablePrompt = ModalsV2.useModal(ModalsV2.VariablePrompt);
  const [isLoading, setIsLoading] = React.useState(false);

  const actions = useGenerativeFooterActions(data, onChange);

  const [preview, setPreview] = useSessionStorageState<string | null>(`${data.nodeID}_preview`, null);

  const getGenOptions = useGenOptions();

  const onPreview = async () => {
    if (isLoading) return;

    let { prompt } = data;
    const variablesToFill = deepVariableSearch(prompt, SLOT_REGEXP);
    if (variablesToFill.length) {
      const filledVariables = await variablePrompt.openVoid({ variablesToFill });
      if (!filledVariables) return;

      prompt = deepVariableReplacement(prompt, filledVariables, SLOT_REGEXP);
    }

    try {
      setIsLoading(true);
      const { result } = await client.gptGen.generativeResponse({ ...getGenOptions(), prompt });
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
        <EditorV2.DefaultFooter>
          <EditorV2.FooterActionsButton actions={actions} />
          <Button variant={Button.Variant.PRIMARY} disabled={!data.prompt || isLoading} onClick={onPreview} width={127}>
            {isLoading ? (
              <SvgIcon icon="arrowSpin" spin />
            ) : (
              <Box.Flex gap={12}>
                <SvgIcon icon="ai" />
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
            <Link fontSize={13}>See examples</Link>
          </Box.Flex>
        }
        headerProps={{ topUnit: 2.5, bottomUnit: 1.375 }}
        contentProps={{ bottomOffset: 3 }}
      >
        <ScrollingPlaceholder placeholders={PLACEHOLDERS} hasContent={!!data.prompt}>
          <VariablesInput value={data.prompt} onBlur={({ text }) => onChange({ prompt: text })} multiline newLineOnEnter />
        </ScrollingPlaceholder>
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
            <SvgIcon icon="copy" color={SvgIcon.DEFAULT_COLOR} clickable onClick={copyWithToast(preview)} />
            {preview}
          </ResponsePreviewContainer>
        </SectionV2.SimpleContentSection>
      )}
    </EditorV2>
  );
};

export default Editor;
