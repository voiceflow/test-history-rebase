import React from 'react';

import { DialogType, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyBucketURL } from '@/utils/audio';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { stripHTMLTags } from '@/utils/string';

import { NODE_CONFIG } from '../constants';

export type SpeakStepItem = {
  id: string;
  url?: string;
  type: DialogType;
  content?: string;
  isAudio?: boolean;
};

export type SpeakStepProps = {
  items: SpeakStepItem[];
  random?: boolean;
  portID: string;
  nodeID: string;
  platform: PlatformType;
};

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, nodeID, portID }) => {
  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, type, content, isAudio }, index) => (
            <Item
              placeholder={getPlatformValue(platform, {
                [PlatformType.ALEXA]: isAudio ? 'Upload audio file' : 'What will Alexa say?',
                [PlatformType.GOOGLE]: 'What will Google say?',
                [PlatformType.GENERAL]: 'What will the assistant say?',
              })}
              key={String(index)}
              label={content ? stripHTMLTags(transformVariablesToReadable(content)) : null}
              icon={random ? 'speakRandomized' : NODE_CONFIG.getIcon!({ dialogs: [{ id, type }], randomize: false })}
              portID={index === itemsToRender.length - 1 ? portID : null}
              iconColor={NODE_CONFIG.getIconColor!({
                dialogs: [{ id, type: isAudio && !random ? DialogType.AUDIO : DialogType.VOICE }],
                randomize: false,
              })}
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
            icon={NODE_CONFIG.getIcon!({ dialogs: [{ id: '', type: DialogType.VOICE }], randomize: false })}
            iconColor={NODE_CONFIG.getIconColor!({ dialogs: [{ id: '', type: DialogType.VOICE }], randomize: false })}
          />
        )}
      </Section>
    </Step>
  );
};

const ConnectedSpeakStep: React.FC<ConnectedStepProps<NodeData.Speak>> = ({ node, data, platform }) => {
  const items = data.dialogs.map(({ id, url, type, content }) => ({
    id,
    type,
    content: content || prettifyBucketURL(url),
    isAudio: type === DialogType.AUDIO,
  }));

  return <SpeakStep items={items} platform={platform} random={data.randomize} nodeID={node.id} portID={node.ports.out[0]} />;
};

export default ConnectedSpeakStep;
