import React from 'react';

import { DialogType, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { BaseStepProps, ConnectedStepProps, Item, ItemProps, Section } from '@/pages/Canvas/components/Step';

export type SpeakStepItem = {
  content?: string;
  url?: string;
  isAudio?: boolean;
};

export type SpeakStepProps = BaseStepProps &
  Pick<ItemProps, 'portID'> & {
    items: SpeakStepItem[];
    random?: boolean;
    withPort?: boolean;
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

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, withPort = true, platform, isActive, portID }) => {
  const itemProps = {
    portColor: '#6e849a',
    placeholder: `What will ${PlatformType.GOOGLE === platform ? 'Google' : 'Alexa'} say?`,
  };

  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step isActive={isActive}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ content, isAudio }, index) => (
            <Item
              {...itemProps}
              key={`${index}`}
              label={content}
              icon={random ? Icon.RANDOM : isAudio ? Icon.AUDIO : Icon.TEXT} // eslint-disable-line no-nested-ternary
              portID={withPort && index === itemsToRender.length - 1 ? portID : null}
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

const ConnectedSpeakStep: React.FC<ConnectedStepProps<NodeData.Speak>> = ({ node, data, stepProps, platform }) => {
  const items = data.dialogs.map((dialog) => {
    return {
      content: dialog.content || dialog.url,
      isAudio: dialog.type === DialogType.AUDIO,
    };
  });

  return <SpeakStep items={items} platform={platform} random={data.randomize} portID={node.ports.out[0]} {...stepProps} />;
};

export default ConnectedSpeakStep;
