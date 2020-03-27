import React from 'react';

import { DialogType, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type SpeakStepItem = {
  content?: string;
  url?: string;
  isAudio?: boolean;
};

export type SpeakStepProps = {
  items: SpeakStepItem[];
  random?: boolean;
  platform: PlatformType;
  portID: string;
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

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, portID }) => {
  const itemProps = {
    portColor: '#6e849a',
    placeholder: `What will ${PlatformType.GOOGLE === platform ? 'Google' : 'Alexa'} say?`,
  };

  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ content, isAudio }, index) => (
            <Item
              {...itemProps}
              key={`${index}`}
              label={content}
              icon={random ? Icon.RANDOM : isAudio ? Icon.AUDIO : Icon.TEXT} // eslint-disable-line no-nested-ternary
              portID={index === itemsToRender.length - 1 ? portID : null}
              iconColor={isAudio ? IconColor.AUDIO : IconColor.DEFAULT}
              labelVariant={isAudio ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
              multilineLabel={!isAudio}
              labelLineClamp={4}
            />
          ))
        ) : (
          <Item {...itemProps} icon={Icon.TEXT} iconColor={IconColor.DEFAULT} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedSpeakStep: React.FC<ConnectedStepProps<NodeData.Speak>> = ({ node, data, platform }) => {
  const items = data.dialogs.map((dialog) => ({
    content: dialog.content || dialog.url,
    isAudio: dialog.type === DialogType.AUDIO,
  }));

  return <SpeakStep items={items} platform={platform} random={data.randomize} portID={node.ports.out[0]} />;
};

export default ConnectedSpeakStep;
