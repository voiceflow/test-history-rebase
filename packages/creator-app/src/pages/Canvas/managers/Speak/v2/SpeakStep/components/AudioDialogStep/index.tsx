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
  items,
  random,
  palette,
  content,
  url,
  isLastItem,
  nextPortID,
  onOpenEditor,
}) => {
  const { duration, playing, setPlaying } = AudioPlayer.useAudioPlayer({ audioURL: url, isUsingDOMElement: false });

  const getAudioTitle = (content?: string | null) => (content ? Utils.string.stripHTMLTags(transformVariablesToReadable(content)) : '');

  const audioDuration = React.useMemo(() => duration && `0:${Math.floor(duration)}`, [duration]);

  const audioVariants = React.useMemo(() => {
    return items.filter((item) => item.type === DialogType.AUDIO && item.url).map(({ content, id }) => ({ id, url: getAudioTitle(content) }));
  }, [items]);

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

  const label = audioDuration || null;

  return (
    <>
      <Step.Item
        title={<AudioTitle>{getAudioTitle(content) || 'Audio'}</AudioTitle>}
        placeholder="Upload audio file"
        label={label}
        prefix={<PlayButton content={content} playing={playing} onPlay={() => setPlaying(true)} onStop={() => setPlaying(false)} />}
        portID={isLastItem ? nextPortID : null}
        palette={palette}
        withNewLines
        labelVariant={StepLabelVariant.PRIMARY}
        labelLineClamp={100}
        multilineLabel
        v2
      />
      {attachment}
    </>
  );
};

export default AudioDialogStep;
