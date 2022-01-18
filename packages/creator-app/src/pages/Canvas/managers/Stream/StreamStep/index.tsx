import { Models } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface StreamStepProps {
  audio: string;
  nodeID: string;
  platform: Constants.PlatformType;
  nextPortID: string;
  customPause: boolean;
  pausePortID?: string;
  previousPortID?: string;
  variant: BlockVariant;
}

export const StreamStep: React.FC<StreamStepProps> = ({ audio, platform, customPause, nodeID, nextPortID, pausePortID, previousPortID, variant }) => {
  const isGoogle = Realtime.Utils.typeGuards.isGooglePlatform(platform);

  return (
    <Step nodeID={nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={audio}
          portID={isGoogle ? nextPortID : undefined}
          variant={variant}
          placeholder="Add an Audio file, URL or variable"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>

      {!isGoogle && (
        <Section>
          <Item icon="choice" variant={variant} label="Next" portID={nextPortID} />

          <Item label="Previous" portID={previousPortID} />

          {customPause && <Item label="Pause" portID={pausePortID} />}
        </Section>
      )}
    </Step>
  );
};

const ConnectedStreamStep: ConnectedStep<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = ({ node, data, platform, variant }) => (
  <StreamStep
    audio={data.audio && transformVariablesToReadable(data.audio)}
    nodeID={node.id}
    platform={platform}
    nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    pausePortID={node.ports.out.builtIn[Models.PortType.PAUSE]}
    customPause={data.customPause}
    previousPortID={node.ports.out.builtIn[Models.PortType.PREVIOUS]}
    variant={variant}
  />
);

export default ConnectedStreamStep;
