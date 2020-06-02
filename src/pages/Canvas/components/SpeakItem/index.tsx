import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';
import { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import AudioUpload from '@/components/Upload/AudioUpload';
import { DialogType, PlatformType } from '@/constants';
import { SSMLData, SpeakData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { getAudioTitle } from '@/utils/audio';
import { compose } from '@/utils/functional';
import { ObjectWithId } from '@/utils/normalized';

import AudioIcon from './AudioIcon';

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
};

function isVoice(item: SpeakData): item is SSMLData {
  return item.type === DialogType.VOICE;
}

const AnySSML = SSMLWithVars as any;
const AnyEditorSection = EditorSection as any;

const SpeakItem: React.RefForwardingComponent<HTMLDivElement, SpeakItemProps> = (
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
  },
  ref
) => {
  const isAlexa = platform === PlatformType.ALEXA;
  const isNew = latestCreatedKey === itemKey;

  const updateContent = React.useCallback(({ text }) => onUpdate({ content: text }), [onUpdate]);
  const updateAudio = React.useCallback((url) => onUpdate({ url }), [onUpdate]);
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
      header={header || (isVoice(item) ? 'System Says' : getAudioTitle(item.url) || 'Audio')}
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
        <FormControl>
          {isVoice(item) ? (
            <AnySSML
              icon={null}
              voice={item.voice}
              value={item.content}
              onBlur={updateContent}
              placeholder={isAlexa ? 'Enter what Alexa will say' : 'Enter what Google will say'}
              onChangeVoice={updateVoice}
            />
          ) : (
            <AudioUpload audio={item.url} update={updateAudio} />
          )}
        </FormControl>
      )}
    </AnyEditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(SpeakItem);
