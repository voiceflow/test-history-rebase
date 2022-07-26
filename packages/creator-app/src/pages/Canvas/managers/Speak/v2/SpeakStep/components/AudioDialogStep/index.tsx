import { Utils } from '@voiceflow/common';
import { AudioPlayer, Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { DialogType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

import { SpeakStepItem, SpeakStepProps } from '../../types';
import AudioDialogPreview from '../AudioDialogPreview';
import PlayButton from './components/PlayButton';
import { AudioTitle } from './styles';

export const AudioDialogStep: React.FC<SpeakStepItem & SpeakStepProps> = ({
  url,
  items,
  random,
  palette,
  content,
  isLastItem,
  nextPortID,
  onOpenEditor,
}) => {
  const audioPlayer = AudioPlayer.useAudioPlayer({ audioURL: url });

  const getAudioTitle = (content?: string | null) => (content ? Utils.string.stripHTMLTags(transformVariablesToReadable(content)) : '');

  const audioVariants = React.useMemo(
    () => items.filter((item) => item.type === DialogType.AUDIO && item.url).map(({ content, id }) => ({ id, url: getAudioTitle(content) })),
    [items]
  );

  const attachment =
    audioVariants.length > 1 && random ? (
      <Step.StepPreviewButton>
        <Popper
          placement="right-start"
          borderRadius="8px"
          renderContent={({ onClose }) => <AudioDialogPreview audioVariants={audioVariants} onClose={onClose} onOpenEditor={onOpenEditor} />}
        >
          {({ onToggle, ref, isOpened }) => (
            <Step.StepButton
              ref={ref}
              onClick={stopPropagation(onToggle)}
              icon="randomV2"
              isActive={isOpened}
              style={{ width: '40px', marginLeft: '12px' }}
            />
          )}
        </Popper>
      </Step.StepPreviewButton>
    ) : null;

  return (
    <>
      <Step.Item
        v2
        title={<AudioTitle>{getAudioTitle(content) || 'Audio'}</AudioTitle>}
        label={AudioPlayer.formatTime(audioPlayer.duration)}
        prefix={<PlayButton content={content} playing={audioPlayer.playing} onToggle={audioPlayer.onToggle} />}
        portID={isLastItem ? nextPortID : null}
        palette={palette}
        placeholder="Upload file or link"
        withNewLines
        labelVariant={StepLabelVariant.PRIMARY}
        labelLineClamp={100}
        multilineLabel
      />
      {attachment}
    </>
  );
};

export default AudioDialogStep;
