import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { DialogType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyBucketURL } from '@/utils/audio';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { stripHTMLTags } from '@/utils/string';

import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '../constants';

export interface SpeakStepItem {
  id: string;
  url?: string;
  type: DialogType;
  content?: string;
  isAudio?: boolean;
}

export interface SpeakStepProps {
  items: SpeakStepItem[];
  random?: boolean;
  portID: string;
  nodeID: string;
  platform: Constants.PlatformType;
}

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, nodeID, portID }) => {
  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, content, isAudio }, index) => (
            <Item
              key={id}
              placeholder={getPlatformValue(
                platform,
                {
                  [Constants.PlatformType.ALEXA]: isAudio ? 'Upload audio file' : 'Add Alexa reply',
                  [Constants.PlatformType.GOOGLE]: 'Add Google reply',
                },
                'Add Assistant reply'
              )}
              label={content ? stripHTMLTags(transformVariablesToReadable(content)) : null}
              icon={NODE_CONFIG.getIcon!(isAudio ? AUDIO_MOCK_DATA : VOICE_MOCK_DATA)}
              portID={index === itemsToRender.length - 1 ? portID : null}
              iconColor={NODE_CONFIG.getIconColor!(isAudio ? AUDIO_MOCK_DATA : VOICE_MOCK_DATA)}
              withNewLines
              labelVariant={isAudio ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
              multilineLabel={!isAudio}
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item
            placeholder={getPlatformValue(
              platform,
              {
                [Constants.PlatformType.ALEXA]: 'Add Alexa reply',
                [Constants.PlatformType.GOOGLE]: 'Add Google reply',
              },
              'Add Assistant reply'
            )}
            icon={NODE_CONFIG.getIcon!(VOICE_MOCK_DATA)}
            iconColor={NODE_CONFIG.getIconColor!(VOICE_MOCK_DATA)}
          />
        )}
      </Section>
    </Step>
  );
};

const ConnectedSpeakStep: React.FC<ConnectedStepProps<NodeData.Speak>> = ({ node, data, platform }) => {
  const items = data.dialogs.map((item) => ({
    id: item.id,
    type: item.type,
    content: item.type === DialogType.AUDIO ? prettifyBucketURL(item.url) : item.content,
    isAudio: item.type === DialogType.AUDIO,
  }));

  return (
    <SpeakStep
      items={items}
      random={!data.canvasVisibility ? data.randomize : data.canvasVisibility === Node.Utils.CanvasNodeVisibility.PREVIEW}
      nodeID={node.id}
      portID={node.ports.out[0]}
      platform={platform}
    />
  );
};

export default ConnectedSpeakStep;
