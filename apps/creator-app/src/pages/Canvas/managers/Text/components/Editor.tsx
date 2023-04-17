import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { PromptsSection, PromptsSectionRef } from '@/pages/Canvas/managers/components';
import useCanvasVisibilityOption from '@/pages/Canvas/managers/hooks/useCanvasVisibilityOption';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

const Editor: NodeEditorV2<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = (editor) => {
  const promptSectionRef = React.useRef<PromptsSectionRef>(null);

  const gptResponseGen = GPT.useGPTGenFeatures();

  const gptGenChatPrompt = GPT.useGenChatPrompts({
    examples: editor.data.texts,
    onAccept: (recommended) => editor.onChange({ texts: [...editor.data.texts, ...recommended] }),
    acceptAllOnChange: editor.isOpened,
  });

  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter>
          <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />
        </EditorV2.DefaultFooter>
      }
    >
      <PromptsSection
        ref={promptSectionRef}
        title="Variants"
        prompts={editor.data.texts}
        minItems={1}
        onChange={(items) => editor.onChange({ texts: items as Realtime.NodeData.Text['texts'] })}
        readOnly={!!gptGenChatPrompt.items.length}
      >
        {({ isEmpty, mapManager }) =>
          gptResponseGen.isEnabled && (
            <>
              {gptGenChatPrompt.items.map((item, index) => (
                <Box key={item.id} pt={16}>
                  <GPT.Prompt
                    index={mapManager.size + index + 1}
                    prompt={item}
                    onFocus={() => gptGenChatPrompt.onFocusItem(index)}
                    isActive={editor.isOpened && index === gptGenChatPrompt.activeIndex}
                    onReject={() => gptGenChatPrompt.onRejectItem(index)}
                    onChange={(data) => gptGenChatPrompt.onChangeItem(index, { ...item, ...data })}
                    storageKey="recommended-chat-prompts"
                    popperLabel="variant"
                    activeIndex={gptGenChatPrompt.activeIndex}
                    popperDescription="Closing the editor or navigating away will accept all variants."
                  />
                </Box>
              ))}

              <Box pt={16}>
                <GPT.GenerateButton.Prompt
                  label="variant"
                  disabled={!!gptGenChatPrompt.items.length || gptGenChatPrompt.fetching}
                  isLoading={gptGenChatPrompt.fetching}
                  onGenerate={({ quantity }) => gptGenChatPrompt.onGenerate({ quantity, examples: promptSectionRef.current?.getCurrentValues() })}
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
