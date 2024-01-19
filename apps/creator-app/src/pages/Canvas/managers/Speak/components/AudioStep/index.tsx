import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AudioPlayer, Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { prettifyBucketURL } from '@/utils/audio';
import { transformVariablesToReadable } from '@/utils/slot';

import StepPreview from '../StepPreview';
import { BaseStepProps } from '../types';
import PlayButton from './components/PlayButton';
import * as S from './styles';

interface AudioStepProps extends BaseStepProps {
  item: Realtime.AudioData;
}

export const AudioStep: React.FC<AudioStepProps> = ({ item, palette, nextPortID, onOpenEditor, attachmentItems }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const audioPlayer = AudioPlayer.useAudioPlayer({ audioURL: item.url });
  const prettifiedURL = React.useMemo(
    () => Utils.string.stripHTMLTags(transformVariablesToReadable(prettifyBucketURL(item.url), entitiesAndVariables.byKey)),
    [item.url, entitiesAndVariables.byKey]
  );

  return (
    <>
      <Step.Item
        v2
        title={<S.Title>{prettifiedURL || 'Audio'}</S.Title>}
        label={AudioPlayer.formatTime(audioPlayer.duration)}
        prefix={<PlayButton content={prettifiedURL} playing={audioPlayer.playing} onToggle={audioPlayer.onToggle} />}
        portID={nextPortID}
        palette={palette}
        placeholder="Upload file or link"
        withNewLines
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
        labelLineClamp={100}
      />

      {!!attachmentItems.length && (
        <Step.StepPreviewButton>
          <Popper
            placement="right-start"
            renderContent={({ onClose }) => <StepPreview items={attachmentItems} onClose={onClose} onOpenEditor={onOpenEditor} />}
          >
            {({ onToggle, ref, isOpened }) => (
              <Step.StepButton
                ref={ref}
                icon="randomV2"
                style={{ width: '40px', marginLeft: '12px' }}
                onClick={stopPropagation(onToggle)}
                isActive={isOpened}
              />
            )}
          </Popper>
        </Step.StepPreviewButton>
      )}
    </>
  );
};

export default AudioStep;
