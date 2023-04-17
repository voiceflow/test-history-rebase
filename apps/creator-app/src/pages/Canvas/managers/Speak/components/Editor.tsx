import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import { DialogType } from '@/constants';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { PromptsSection, PromptsSectionRef } from '@/pages/Canvas/managers/components';
import useCanvasVisibilityOption from '@/pages/Canvas/managers/hooks/useCanvasVisibilityOption';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { getLabelByType } from '../constants';
import { isVoiceItem } from './utils';

const Editor: NodeEditorV2<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = (editor) => {
  const isVoiceEditor = isVoiceItem(editor.data.dialogs[0]);
  const promptSectionRef = React.useRef<PromptsSectionRef>(null);

  const items = React.useMemo(() => Realtime.Adapters.voicePromptToSpeakDataAdapter.mapToDB(editor.data.dialogs), [editor.data.dialogs]);

  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));

  const onChangeItems = (newItems: Platform.Base.Models.Prompt.Model[]) =>
    editor.onChange({
      dialogs: Realtime.Adapters.voicePromptToSpeakDataAdapter.mapFromDB(newItems as Platform.Common.Voice.Models.Prompt.Model[]),
    });

  const gptResponseGen = GPT.useGPTGenFeatures();

  const gptGenVoicePrompt = GPT.useGenVoicePrompts({
    examples: items,
    onAccept: (recommended) => onChangeItems([...items, ...recommended]),
    acceptAllOnChange: editor.isOpened,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title={getLabelByType(isVoiceEditor ? DialogType.VOICE : DialogType.AUDIO)} />}
      footer={
        <EditorV2.DefaultFooter>
          <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />
        </EditorV2.DefaultFooter>
      }
    >
      <PromptsSection
        ref={promptSectionRef}
        title="Variants"
        prompts={items}
        minItems={1}
        onChange={(items) => onChangeItems(items)}
        readOnly={!!gptGenVoicePrompt.items.length}
      >
        {({ isEmpty, mapManager }) =>
          gptResponseGen.isEnabled &&
          isVoiceEditor && (
            <>
              {gptGenVoicePrompt.items.map((item, index) => (
                <Box key={item.id} pt={16}>
                  <GPT.Prompt
                    index={mapManager.size + index + 1}
                    prompt={item}
                    onFocus={() => gptGenVoicePrompt.onFocusItem(index)}
                    isActive={editor.isOpened && index === gptGenVoicePrompt.activeIndex}
                    onReject={() => gptGenVoicePrompt.onRejectItem(index)}
                    onChange={(data) => gptGenVoicePrompt.onChangeItem(index, { ...item, ...data })}
                    storageKey="recommended-voice-prompts"
                    popperLabel="variant"
                    activeIndex={gptGenVoicePrompt.activeIndex}
                    popperDescription="Closing the editor or navigating away will accept all variants."
                  />
                </Box>
              ))}

              <Box pt={16}>
                <GPT.GenerateButton.Prompt
                  label="variant"
                  disabled={!!gptGenVoicePrompt.items.length || gptGenVoicePrompt.fetching}
                  isLoading={gptGenVoicePrompt.fetching}
                  onGenerate={({ quantity }) => gptGenVoicePrompt.onGenerate({ quantity, examples: promptSectionRef.current?.getCurrentValues() })}
                  pluralLabel="variants"
                  hasExtraContext={!isEmpty}
                />
              </Box>
            </>
          )
        }
      </PromptsSection>

      <SectionV2.Divider />
    </EditorV2>
  );
};

export default Editor;
