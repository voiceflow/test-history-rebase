import React from 'react';

import Box from '@/components/Box';
import { SectionToggleVariant } from '@/components/Section';
import SSMLWithVars from '@/components/SSMLWithVars';
import SvgIcon from '@/components/SvgIcon';
import AudioUpload from '@/components/Upload/AudioUpload';
import VariablesInput from '@/components/VariablesInput';
import { DialogType, PlatformType } from '@/constants';
import { SpeakData, SSMLData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { prettifyBucketURL } from '@/utils/audio';
import { compose } from '@/utils/functional';
import { ObjectWithId } from '@/utils/normalized';

import AudioIcon from './AudioIcon';

const VariablesInputComponent: React.FC<any> = VariablesInput;

export type SpeakItemProps = {
  item: ObjectWithId & SpeakData;
  itemKey: any;
  onUpdate: (newState: any) => void;
  platform: PlatformType;
  isOnlyItem: boolean;
  isDragging: boolean;
  isRandomized: boolean;
  onContextMenu: (e: React.MouseEvent) => void;
  latestCreatedKey: React.Ref<any /* useManager normalized store key */>;
  connectedDragRef: React.Ref<HTMLDivElement>;
  isDraggingPreview: boolean;
  isContextMenuOpen: boolean;
  header: React.ReactNode;
  formControlProps?: {
    contentBottomUnits?: number;
  };
};

const isVoice = (item: SpeakData): item is SSMLData => item.type === DialogType.VOICE;

const AnySSML = SSMLWithVars as any;
const AnyEditorSection = EditorSection as any;

const SpeakItem: React.ForwardRefRenderFunction<HTMLDivElement, SpeakItemProps> = (
  {
    item,
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
    header,
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
      prefix={<SvgIcon icon={isVoice(item) ? 'alexa' : AudioIcon} />}
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
