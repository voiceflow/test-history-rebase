import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

function StreamStep({
  audio,
  platform = PlatformType.ALEXA,
  isActive,
  onClickPort,
  onNextClickPort,
  onPreviousClickPort,
  isConnected,
  isNextConnected,
  isPreviousConnected,
  customPause,
  onPauseClickPort,
  isPauseConnected,
}) {
  if (platform === PlatformType.GOOGLE) {
    return (
      <Step isActive={isActive}>
        <Section>
          <Item
            onClickPort={onClickPort}
            icon="audioPlayer"
            iconColor="#4f98c6"
            label={audio}
            isConnected={isConnected}
            placeholder="Add an Audio file, URL or variable"
            labelVariant={StepLabelVariant.SECONDARY}
          />
        </Section>
      </Step>
    );
  }
  return (
    <Step isActive={isActive}>
      <Section>
        <Item
          icon="audioPlayer"
          iconColor="#4f98c6"
          label={audio}
          placeholder="Add an Audio file, URL or variable"
          labelVariant={StepLabelVariant.SECONDARY}
          withPort={false}
        />
      </Section>
      <Section>
        <Item icon="choice" iconColor="#3a5999" onClickPort={onNextClickPort} label="Next" isConnected={isNextConnected} />
        <Item onClickPort={onPreviousClickPort} label="Previous" isConnected={isPreviousConnected} />
        {customPause && <Item onClickPort={onPauseClickPort} label="Pause" isConnected={isPauseConnected} />}
      </Section>
    </Step>
  );
}

export default StreamStep;
