import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, COLOR_PICKER_CONSTANTS, CONTEXT_MENU_IGNORED_CLASS_NAME, SvgIcon, Upload } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { prettifyBucketURL } from '@/utils/audio';

export type SpeakAudioItemProps = ListItemComponentProps<
  Realtime.SpeakData,
  {
    header: React.ReactNode;
    platform: Platform.Constants.PlatformType;
    isRandomized?: boolean;
  }
>;

const SpeakAudioItem = React.forwardRef<HTMLElement, SpeakAudioItemProps>(
  (
    {
      item,
      header,
      itemKey,
      onUpdate,
      platform,
      isOnlyItem,
      isDragging,
      isRandomized,
      onContextMenu,
      latestCreatedKey,
      connectedDragRef,
      isDraggingPreview,
      isContextMenuOpen,
    },
    ref
  ) => {
    const isGoogle = platform === Platform.Constants.PlatformType.GOOGLE;
    const isNew = latestCreatedKey === itemKey;

    const updateContent = React.useCallback(({ text }: { text: string }) => onUpdate({ content: text }), [onUpdate]);
    const updateAudio = React.useCallback((url: string | null) => onUpdate({ url: url ?? '' }), [onUpdate]);
    const updateDesc = React.useCallback(({ text: desc }: { text: string }) => onUpdate({ desc }), [onUpdate]);
    const updateVoice = React.useCallback(
      (value: string) => {
        onUpdate({ voice: value });
      },
      [onUpdate]
    );

    return (
      <EditorSection
        ref={ref as React.Ref<HTMLDivElement>}
        namespace={['speakAudioItem', item.id]}
        initialOpen={isNew || isOnlyItem}
        header={header || (Realtime.isSSML(item) ? 'System Says' : prettifyBucketURL(item.url) || 'Audio')}
        prefix={
          <SvgIcon
            icon={NODE_CONFIG.getIcon!(Realtime.isSSML(item) ? VOICE_MOCK_DATA : AUDIO_MOCK_DATA)}
            color={COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR}
          />
        }
        suffix={isRandomized && 'randomLoop'}
        isDragging={isDragging}
        headerRef={connectedDragRef}
        headerToggle
        collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : null}
        isDraggingPreview={isDraggingPreview}
        onContextMenu={onContextMenu}
        isContextMenuOpen={isContextMenuOpen}
      >
        {isDragging || isDraggingPreview ? null : (
          <FormControl contentBottomUnits={2.5}>
            {Realtime.isSSML(item) ? (
              <SSMLWithVars
                icon={null}
                voice={item.voice}
                value={item.content}
                onBlur={updateContent}
                onChangeVoice={updateVoice}
                skipBlurOnUnmount
              />
            ) : (
              <>
                <Upload.AudioUpload
                  audio={item.url}
                  update={updateAudio}
                  className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                  renderInput={VariablesInput.renderInput}
                />
                {isGoogle && item.url && (
                  <Box mt={12}>
                    <VariablesInput value={item.desc || ''} onBlur={updateDesc} placeholder="Enter audio description" multiline />
                  </Box>
                )}
              </>
            )}
          </FormControl>
        )}
      </EditorSection>
    );
  }
);

export default React.memo(SpeakAudioItem);
