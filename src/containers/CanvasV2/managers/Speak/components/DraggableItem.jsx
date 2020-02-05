import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import SSMLWithVars from '@/componentsV2/SSMLWithVars';
import { SectionToggleVariant } from '@/componentsV2/Section';
import AudioUpload from '@/componentsV2/Upload/AudioUpload';
import { DialogType, PlatformType } from '@/constants';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import EditorSection from '@/containers/CanvasV2/components/EditorSection';
import { getAudioTitle } from '@/utils/audio';
import { compose } from '@/utils/functional';

import AudioIcon from './AudioIcon';

const DraggableItem = (
  { itemKey, item, platform, isRandomized, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef },
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
      prefix={<SvgIcon variant="standard" icon={isVoice ? 'alexa' : AudioIcon} />}
      suffix={isRandomized && 'randomLoop'}
      isDragging={isDragging}
      headerRef={connectedDragRef}
      headerToggle
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDraggingPreview={isDraggingPreview}
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

export default compose(
  React.memo,
  React.forwardRef
)(DraggableItem);
