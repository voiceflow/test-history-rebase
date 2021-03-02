import React from 'react';

import { DialogType, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyBucketURL } from '@/utils/audio';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { stripHTMLTags } from '@/utils/string';

import { ICON, ICON_COLOR } from '../constants';

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
  nodeID: string;
};

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, nodeID, portID }) => {
  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ content, isAudio }, index) => (
            <Item
              placeholder={getPlatformValue(platform, {
                [PlatformType.ALEXA]: isAudio ? 'Upload audio file' : 'What will Alexa say?',
                [PlatformType.GOOGLE]: 'What will Google say?',
                [PlatformType.GENERAL]: 'What will the assistant say?',
              })}
              key={`${index}`}
              label={content ? stripHTMLTags(transformVariablesToReadable(content)) : null}
              icon={random ? 'speakRandomized' : isAudio ? ICON[DialogType.AUDIO] : ICON[DialogType.VOICE]} // eslint-disable-line no-nested-ternary
              portID={index === itemsToRender.length - 1 ? portID : null}
              iconColor={isAudio && !random ? ICON_COLOR[DialogType.AUDIO] : ICON_COLOR[DialogType.VOICE]}
              labelVariant={isAudio ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
              multilineLabel={!isAudio}
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item
            placeholder={getPlatformValue(platform, {
              [PlatformType.ALEXA]: 'What will Alexa say?',
              [PlatformType.GOOGLE]: 'What will Google say?',
              [PlatformType.GENERAL]: 'What will the assistant say?',
            })}
            icon={ICON[DialogType.VOICE]}
            iconColor={ICON_COLOR[DialogType.VOICE]}
          />
        )}
      </Section>
    </Step>
  );
};

const ConnectedSpeakStep: React.FC<ConnectedStepProps<NodeData.Speak>> = ({ node, data, platform }) => {
  const items = data.dialogs.map((dialog) => ({
    content: dialog.content || prettifyBucketURL(dialog.url),
    isAudio: dialog.type === DialogType.AUDIO,
  }));

  return <SpeakStep items={items} platform={platform} random={data.randomize} nodeID={node.id} portID={node.ports.out[0]} />;
};

export default ConnectedSpeakStep;
