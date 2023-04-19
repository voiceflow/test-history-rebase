import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import * as GPT from '@/components/GPT';
import { MAX_ALEXA_REPROMPTS, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks/realtime';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { EngineContext } from '@/pages/Canvas/contexts';

import Actions from '../../Actions';
import { useGenerateBuiltInResponses } from '../../hooks';
import PathSection from '../../PathSection';
import PromptsSection, { PromptsSectionRef } from '../../PromptsSection';
import { BUILT_IN_NO_REPLIES_BY_LOCALE, DEFAULT_BUILT_IN_NO_REPLIES } from '../constants';
import HelpTooltip from './HelpTooltip';
import TimeoutSection from './TimeoutSection';

export interface RootEditorLocationState {
  autogenerate?: boolean;
  autogenerateQuantity?: number;
}

interface Data {
  noReply: Realtime.NodeData.NoReply;
}

const RootEditor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data>();
  const location = useLocation<RootEditorLocationState>();
  const promptSectionRef = React.useRef<PromptsSectionRef>(null);

  const transaction = useDispatch(History.transaction);

  const { noReply } = editor.data;

  const noReplyPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_REPLY];

  const onChange = async (data: Partial<Realtime.NodeData.NoReply>) => {
    if (Utils.object.shallowPartialEquals(noReply, data)) return;

    await editor.onChange({ noReply: { ...noReply, ...data } as Realtime.NodeData.NoReply });
  };

  const onChangeReprompts = async (reprompts: Platform.Base.Models.Prompt.Model[]) => {
    if (!reprompts.length) {
      await onChange({ types: Utils.array.withoutValue(noReply.types, BaseNode.Utils.NoReplyType.REPROMPT), reprompts: [] });
    } else {
      await onChange({
        types: Utils.array.unique([...noReply.types, BaseNode.Utils.NoReplyType.REPROMPT]),
        reprompts,
      } as Partial<Realtime.NodeData.NoReply>);
    }
  };

  const onAddPath = () =>
    transaction(async () => {
      await engine.port.addBuiltin(editor.nodeID, BaseModels.PortType.NO_REPLY);
      await onChange({ types: Utils.array.unique([...noReply.types, BaseNode.Utils.NoReplyType.PATH]) });
    });

  const onRemovePath = async () => {
    await transaction(async () => {
      if (noReplyPortID) {
        await engine.port.removeBuiltin(noReplyPortID);
      }

      await onChange({ types: Utils.array.withoutValue(noReply.types, BaseNode.Utils.NoReplyType.PATH) });
    });
  };

  const generateBuiltInResponses = useGenerateBuiltInResponses({
    defaultResponses: DEFAULT_BUILT_IN_NO_REPLIES,
    responsesByLocale: BUILT_IN_NO_REPLIES_BY_LOCALE,
  });

  const gptGenPrompt = GPT.useGenPrompts({
    examples: noReply.reprompts ?? [],
    onAccept: (recommended) => onChangeReprompts([...(noReply.reprompts ?? []), ...recommended]),
    generateBuiltIn: generateBuiltInResponses,
    acceptAllOnChange: editor.isOpened,
  });

  const gptNoReplyGen = GPT.useGPTGenFeatures();

  React.useEffect(() => {
    if (!location.state?.autogenerate) return;

    gptGenPrompt.onGenerate({ quantity: location.state.autogenerateQuantity ?? 1 });
  }, []);

  const withPath = noReply.types.includes(BaseNode.Utils.NoReplyType.PATH);
  const maxItems = Realtime.Utils.typeGuards.isAlexaPlatform(editor.platform) ? MAX_ALEXA_REPROMPTS : MAX_SYSTEM_MESSAGES_COUNT;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <EditorV2.FooterActionsButton
            actions={[
              {
                label: noReply.randomize ? 'Unrandomize responses' : 'Randomize responses',
                onClick: () => onChange({ randomize: !noReply.randomize }),
              },
            ]}
            placement="bottom-end"
          />
        </EditorV2.DefaultFooter>
      }
    >
      <TimeoutSection timeout={noReply.timeout} onChange={(timeout) => onChange({ timeout })} />

      <SectionV2.Divider />

      <PromptsSection
        ref={promptSectionRef}
        title="No reply"
        active={!!noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT)}
        prompts={noReply.reprompts ?? []}
        maxItems={maxItems}
        onChange={onChangeReprompts}
        voiceMulti
        readOnly={!!gptGenPrompt.items.length}
        dynamicPlaceholder={(i) => `Enter no reply ${i + 1}`}
      >
        {({ mapManager }) =>
          gptNoReplyGen.isEnabled && (
            <Box pt={mapManager.isEmpty ? 0 : 16}>
              {gptGenPrompt.items.map((item, index) => (
                <Box key={item.id} pb={16}>
                  <GPT.Prompt
                    index={mapManager.size + index + 1}
                    prompt={item}
                    onFocus={() => gptGenPrompt.onFocusItem(index)}
                    isActive={editor.isOpened && index === gptGenPrompt.activeIndex}
                    onReject={() => gptGenPrompt.onRejectItem(index)}
                    onChange={(data) => gptGenPrompt.onChangeItem(index, { ...item, ...data })}
                    storageKey="recommended-no-replay-prompts"
                    popperLabel="response"
                    activeIndex={gptGenPrompt.activeIndex}
                    popperDescription="Closing the editor or navigating away will accept all responses."
                  />
                </Box>
              ))}

              <GPT.GenerateButton.Prompt
                label="response"
                disabled={!!gptGenPrompt.items.length || gptGenPrompt.fetching || mapManager.size >= maxItems}
                isLoading={gptGenPrompt.fetching}
                onGenerate={({ quantity }) => gptGenPrompt.onGenerate({ quantity, examples: promptSectionRef.current?.getCurrentValues() })}
                pluralLabel="responses"
                hasExtraContext
              />
            </Box>
          )
        }
      </PromptsSection>

      <SectionV2.Divider />

      <PathSection
        onAdd={onAddPath}
        pathName={noReply.pathName ?? ''}
        onRemove={onRemovePath}
        onRename={(pathName) => onChange({ pathName })}
        collapsed={!withPath}
      />

      {withPath && !!noReplyPortID && (
        <>
          <SectionV2.Divider inset />

          <Actions.Section portID={noReplyPortID} editor={editor} />
        </>
      )}
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noReply)(RootEditor);
