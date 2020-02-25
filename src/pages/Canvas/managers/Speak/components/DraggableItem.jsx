import React from 'react';

import SSMLWithVars from '@/components/SSMLWithVars';
import { SectionToggleVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import AudioUpload from '@/components/Upload/AudioUpload';
import { DialogType, PlatformType } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { getAudioTitle } from '@/utils/audio';
import { compose } from '@/utils/functional';

import AudioIcon from './AudioIcon';

const DraggableItem = (
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
  },
  ref
) => {
  const { url, type, voice, content } = item;
  const isAlexa = platform === PlatformType.ALEXA;
  const isVoice = type === DialogType.VOICE;
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
    <EditorSection
      ref={ref}
      namespace={['speakItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={isVoice ? 'System Says' : getAudioTitle(url)}
      prefix={<SvgIcon icon={isVoice ? 'alexa' : AudioIcon} />}
      suffix={isRandomized && 'randomLoop'}
      isDragging={isDragging}
      headerRef={connectedDragRef}
      headerToggle
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <FormControl>
          {isVoice ? (
            <SSMLWithVars
              icon={null}
              voice={voice}
              value={content}
              onBlur={updateContent}
              placeholder={isAlexa ? 'Enter what Alexa will say' : 'Enter what Google will say'}
              onChangeVoice={updateVoice}
            />
          ) : (
            <AudioUpload audio={url} update={updateAudio} />
          )}
        </FormControl>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(DraggableItem);
