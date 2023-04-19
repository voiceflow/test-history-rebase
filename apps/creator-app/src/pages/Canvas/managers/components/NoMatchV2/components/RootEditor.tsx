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
import { BUILT_IN_NO_MATCHES_BY_LOCALE, DEFAULT_BUILT_IN_NO_MATCHES } from '../constants';
import HelpTooltip from './HelpTooltip';

export interface RootEditorLocationState {
  autogenerate?: boolean;
  autogenerateQuantity?: number;
}

interface Data {
  noMatch: Realtime.NodeData.NoMatch;
}

const RootEditor: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const editor = EditorV2.useEditor<Data>();
  const location = useLocation<RootEditorLocationState>();
  const promptSectionRef = React.useRef<PromptsSectionRef>(null);

  const transaction = useDispatch(History.transaction);

  const { noMatch } = editor.data;
  const noMatchPortID = editor.node.ports.out.builtIn[BaseModels.PortType.NO_MATCH];

  const onChange = async (data: Partial<Realtime.NodeData.NoMatch>) => {
    if (Utils.object.shallowPartialEquals(noMatch, data)) return;
    await editor.onChange({ noMatch: { ...noMatch, ...data } as Realtime.NodeData.NoMatch });
  };

  const onChangeReprompts = async (reprompts: Platform.Base.Models.Prompt.Model[]) => {
    if (!reprompts.length) {
      await onChange({ types: Utils.array.withoutValue(noMatch.types, BaseNode.Utils.NoMatchType.REPROMPT), reprompts: [] });
    } else {
      await onChange({
        types: Utils.array.unique([...noMatch.types, BaseNode.Utils.NoMatchType.REPROMPT]),
        reprompts,
      } as Realtime.NodeData.NoMatch);
    }
  };

  const onAddPath = async () =>
    transaction(async () => {
      await engine.port.addBuiltin(editor.nodeID, BaseModels.PortType.NO_MATCH);
      await onChange({ types: Utils.array.unique([...noMatch.types, BaseNode.Utils.NoMatchType.PATH]) });
    });

  const onRemovePath = () =>
    transaction(async () => {
      if (noMatchPortID) {
        await engine.port.removeBuiltin(noMatchPortID);
      }

      await onChange({ types: Utils.array.withoutValue(noMatch.types, BaseNode.Utils.NoMatchType.PATH) });
    });

  const generateBuiltInResponses = useGenerateBuiltInResponses({
    defaultResponses: DEFAULT_BUILT_IN_NO_MATCHES,
    responsesByLocale: BUILT_IN_NO_MATCHES_BY_LOCALE,
  });

  const gptGenPrompt = GPT.useGenPrompts({
    examples: noMatch.reprompts,
    onAccept: (recommended) => onChangeReprompts([...noMatch.reprompts, ...recommended]),
    generateBuiltIn: generateBuiltInResponses,
    acceptAllOnChange: editor.isOpened,
  });

  const gptNoMatchGen = GPT.useGPTGenFeatures();

  React.useEffect(() => {
    if (!location.state?.autogenerate) return;

    gptGenPrompt.onGenerate({ quantity: location.state.autogenerateQuantity ?? 1 });
  }, []);

  const withPath = noMatch.types.includes(BaseNode.Utils.NoMatchType.PATH);
  const maxItems = Realtime.Utils.typeGuards.isAlexaPlatform(editor.platform) ? MAX_ALEXA_REPROMPTS : MAX_SYSTEM_MESSAGES_COUNT;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <EditorV2.FooterActionsButton
            actions={[
              {
                label: noMatch.randomize ? 'Unrandomize responses' : 'Randomize responses',
                onClick: () => onChange({ randomize: !noMatch.randomize }),
              },
            ]}
            placement="bottom-end"
          />
        </EditorV2.DefaultFooter>
      }
    >
      <PromptsSection
        ref={promptSectionRef}
        title="No match"
        active={!!noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT)}
        prompts={noMatch.reprompts}
        onChange={onChangeReprompts}
        maxItems={maxItems}
        readOnly={!!gptGenPrompt.items.length}
        voiceMulti
        dynamicPlaceholder={(i) => `Enter no match ${i + 1}`}
      >
        {({ mapManager }) =>
          gptNoMatchGen.isEnabled && (
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
                    storageKey="recommended-no-match-prompts"
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
        pathName={noMatch.pathName ?? ''}
        onRemove={onRemovePath}
        onRename={(pathName) => onChange({ pathName })}
        collapsed={!withPath}
      />

      {withPath && !!noMatchPortID && (
        <>
          <SectionV2.Divider inset />

          <Actions.Section editor={editor} portID={noMatchPortID} />
        </>
      )}
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Partial<Data>>((editor) => !editor.data.noMatch)(RootEditor);
