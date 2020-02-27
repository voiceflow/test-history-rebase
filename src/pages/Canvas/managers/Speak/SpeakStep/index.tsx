import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { BaseStepProps, Item, ItemProps, Section } from '@/pages/Canvas/components/Step';

export type SpeakStepItem = {
  label?: string;
  isAudio?: boolean;
};

export type SpeakStepProps = BaseStepProps &
  Pick<ItemProps, 'withPort' | 'isConnected' | 'onClickPort'> & {
    items: SpeakStepItem[];
    random?: boolean;
    platform: PlatformType;
  };

enum Icon {
  TEXT = 'speak',
  AUDIO = 'volume',
  RANDOM = 'speakRandomized',
}

enum IconColor {
  AUDIO = '#f83f55',
  DEFAULT = '#8f8e94',
}

const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, isActive, withPort, onClickPort, isConnected }) => {
  const itemProps = {
    portColor: '#6e849a',
    isConnected,
    onClickPort,
    placeholder: `What will ${PlatformType.GOOGLE === platform ? 'Google' : 'Alexa'} say?`,
  };

  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step isActive={isActive}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ label, isAudio }, index) => (
            <Item
              {...itemProps}
              key={`${label}-${index}`}
              label={label}
              icon={random ? Icon.RANDOM : isAudio ? Icon.AUDIO : Icon.TEXT} // eslint-disable-line no-nested-ternary
              withPort={index === itemsToRender.length - 1 && withPort}
              iconColor={isAudio ? IconColor.AUDIO : IconColor.DEFAULT}
              labelVariant={isAudio ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
              multilineLabel={!isAudio}
              labelLineClamp={4}
            />
          ))
        ) : (
          <Item {...itemProps} icon={Icon.TEXT} withPort={false} iconColor={IconColor.DEFAULT} />
        )}
      </Section>
    </Step>
  );
};

export default SpeakStep;
