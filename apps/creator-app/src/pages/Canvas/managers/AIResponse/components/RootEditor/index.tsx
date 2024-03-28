import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, ThemeColor, TippyTooltip, toast, Toggle } from '@voiceflow/ui';
import React from 'react';

import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import RadioGroup from '@/components/RadioGroup';
import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks/realtime';
import { useEnvironmentSessionStorageState } from '@/hooks/storage.hook';
import { useFillVariables } from '@/hooks/variable';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';
import * as AI from '@/pages/Canvas/managers/components/AI';

import { MEMORY_SELECT_OPTIONS, PLACEHOLDERS } from './constants';
import { useGenerativeFooterActions } from './hooks';
import Preview from './Preview';

const Editor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts>();
  const { source = BaseUtils.ai.DATA_SOURCE.DEFAULT } = editor.data;

  const transaction = useDispatch(History.transaction);
  const actions = useGenerativeFooterActions(editor.onChange);
  const getCompletion = AI.useSourceCompletion();
  const fillVariables = useFillVariables();

  const [preview, setPreview] = useEnvironmentSessionStorageState<string | null>(`${editor.data.nodeID}_preview`, null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(false);

  const knowledgeBase = useKnowledgeBase();
  const isKnowledgeBaseSource = source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE;

  const onPreview = async () => {
    if (isLoading) return;

    const context = await fillVariables({ prompt: editor.data.prompt, system: editor.data.system });
    if (!context) return;

    try {
      setIsLoading(true);
      const output = await getCompletion(source, { ...editor.data, ...context, mode: BaseUtils.ai.PROMPT_MODE.PROMPT });
      if (output) {
        setPreview(output.trim());
      } else if (isKnowledgeBaseSource) {
        setPreview(`${BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND} Unable to find relevant answer.`);
      } else {
        toast.error('Unable to complete prompt');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNoMatchPath = async () => {
    const noMatchPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_MATCH];

    if (editor.data.notFoundPath) {
      await editor.onChange({ notFoundPath: false });
    } else {
      await transaction(async () => {
        // add port if DNE
        if (!noMatchPortID) await engine.port.addBuiltin(editor.nodeID, BaseModels.PortType.NO_MATCH);
        await editor.onChange({ notFoundPath: true });
      });
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
          <>
            <SectionV2.Content topOffset={2.5} bottomOffset={3}>
              <Box fontSize={13} fontWeight={600} color={ThemeColor.SECONDARY} mb={8} cursor="default">
                Question
              </Box>
              <AI.PromptInput
                value={editor.data}
                onChange={editor.onChange}
                onContentChange={setHasContent}
                placeholder="Enter query to knowledge base"
              />
              <Box fontSize={13} fontWeight={600} color={ThemeColor.SECONDARY} mt={16} mb={8}>
                Instructions
              </Box>
              <VariablesInput
                placeholder="Enter instructions for response (optional)"
                value={editor.data.instruction}
                onBlur={({ text: instruction }) => editor.onChange({ instruction })}
                multiline
                newLineOnEnter
              />
            </SectionV2.Content>
            <Preview preview={preview} />
            <SectionV2.Divider />
            <TippyTooltip
              width={208}
              content={
                <TippyTooltip.Multiline>
                  <TippyTooltip.Title>{editor.data.notFoundPath ? 'Enabled' : 'Disabled'}</TippyTooltip.Title>
                  {editor.data.notFoundPath
                    ? 'When toggled on, creates a path and prevents AI from responding if answer is not found.'
                    : 'When toggled off, AI will respond with "Unable to find relevant answer" if answer is not found'}
                </TippyTooltip.Multiline>
              }
              offset={[-16, -10]}
              display="block"
              placement="bottom-end"
            >
              <SectionV2.SimpleSection onClick={toggleNoMatchPath}>
                <SectionV2.Title>Not found path</SectionV2.Title>
                <Toggle size={Toggle.Size.EXTRA_SMALL} checked={editor.data.notFoundPath} />
              </SectionV2.SimpleSection>
            </TippyTooltip>

            <AI.KnowledgeBasePromptSettingsEditor value={editor.data} onValueChange={editor.onChange} />
          </>
        ) : (
          <>
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

            <Preview preview={preview} />

            <AI.PromptSettingsEditor value={editor.data} onValueChange={editor.onChange} />
          </>
        )}
      </SectionV2.Container>
    </EditorV2>
  );
};

export default Editor;
