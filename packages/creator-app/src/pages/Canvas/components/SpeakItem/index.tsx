import { PlatformType } from '@voiceflow/internal';
import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import { SectionToggleVariant } from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import AudioUpload from '@/components/Upload/AudioUpload';
import VariablesInput from '@/components/VariablesInput';
import { DialogType } from '@/constants';
import { SpeakData, SSMLData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { prettifyBucketURL } from '@/utils/audio';
import { compose } from '@/utils/functional';

const VariablesInputComponent: React.FC<any> = VariablesInput;

export type SpeakItemProps = ItemComponentProps<SpeakData> &
  MappedItemComponentHandlers<SpeakData> &
  DragPreviewComponentProps & {
    header: React.ReactNode;
    platform: PlatformType;
    isOnlyItem: boolean;
    isRandomized?: boolean;
    latestCreatedKey?: string;
    formControlProps?: { contentBottomUnits?: number };
  };

const isVoice = (item: SpeakData): item is SSMLData => item.type === DialogType.VOICE;

const AnySSML = SSMLWithVars as any;
const AnyEditorSection = EditorSection as any;

const SpeakItem: React.ForwardRefRenderFunction<HTMLDivElement, SpeakItemProps> = (
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
  },
  ref
) => {
  const isGoogle = platform === PlatformType.GOOGLE;
  const isNew = latestCreatedKey === itemKey;

  const updateContent = React.useCallback(({ text }) => onUpdate({ content: text }), [onUpdate]);
  const updateAudio = React.useCallback((url) => onUpdate({ url }), [onUpdate]);
  const updateDesc = React.useCallback(({ text: desc }) => onUpdate({ desc }), [onUpdate]);
  const updateVoice = React.useCallback(
    (value) => {
      onUpdate({ voice: value });
    },
    [onUpdate]
  );

  return (
    <AnyEditorSection
      ref={ref}
      namespace={['speakItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={header || (isVoice(item) ? 'System Says' : prettifyBucketURL(item.url) || 'Audio')}
      prefix={
        <SvgIcon
          icon={NODE_CONFIG.getIcon!(isVoice(item) ? VOICE_MOCK_DATA : AUDIO_MOCK_DATA)}
          color={NODE_CONFIG.getIconColor!(isVoice(item) ? VOICE_MOCK_DATA : AUDIO_MOCK_DATA)}
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
    </AnyEditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(SpeakItem);
