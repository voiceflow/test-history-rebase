import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import AudioUpload from '@/components/Upload/AudioUpload';
import VariablesInput from '@/components/VariablesInput';
import { BlockVariant, DialogType } from '@/constants';
import { compose } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { getIconColor } from '@/styles/theme/block';
import { prettifyBucketURL } from '@/utils/audio';

const VariablesInputComponent: React.FC<any> = VariablesInput;

export type SpeakAudioItemProps = ListItemComponentProps<
  Realtime.SpeakData,
  {
    header: React.ReactNode;
    platform: VoiceflowConstants.PlatformType;
    isRandomized?: boolean;
    formControlProps?: { contentBottomUnits?: number };
    variant?: BlockVariant;
  }
>;

const isVoice = (item: Realtime.SpeakData): item is Realtime.SSMLData => item.type === DialogType.VOICE;

const AnySSML = SSMLWithVars as any;

const SpeakAudioItem: React.ForwardRefRenderFunction<HTMLDivElement, SpeakAudioItemProps> = (
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
    formControlProps,
    variant,
  },
  ref
) => {
  const isGoogle = platform === VoiceflowConstants.PlatformType.GOOGLE;
  const isNew = latestCreatedKey === itemKey;

  const updateContent = React.useCallback(({ text }) => onUpdate({ content: text }), [onUpdate]);
  const updateAudio = React.useCallback((url: string | null) => onUpdate({ url: url ?? '' }), [onUpdate]);
  const updateDesc = React.useCallback(({ text: desc }) => onUpdate({ desc }), [onUpdate]);
  const updateVoice = React.useCallback(
    (value) => {
      onUpdate({ voice: value });
    },
    [onUpdate]
  );

  return (
    <EditorSection
      ref={ref}
      namespace={['speakAudioItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={header || (isVoice(item) ? 'System Says' : prettifyBucketURL(item.url) || 'Audio')}
      prefix={<SvgIcon icon={NODE_CONFIG.getIcon!(isVoice(item) ? VOICE_MOCK_DATA : AUDIO_MOCK_DATA)} color={getIconColor(variant)} />}
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
        <FormControl {...formControlProps}>
          {isVoice(item) ? (
            <AnySSML icon={null} voice={item.voice} value={item.content} onBlur={updateContent} onChangeVoice={updateVoice} />
          ) : (
            <>
              <AudioUpload audio={item.url} update={updateAudio} />
              {isGoogle && item.url && (
                <Box mt={12}>
                  <VariablesInputComponent value={item.desc || ''} onBlur={updateDesc} placeholder="Enter audio description" multiline />
                </Box>
              )}
            </>
          )}
        </FormControl>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(SpeakAudioItem);
