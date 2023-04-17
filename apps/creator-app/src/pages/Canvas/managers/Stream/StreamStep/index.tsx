import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface StreamStepProps {
  audio: string;
  nodeID: string;
  platform: Platform.Constants.PlatformType;
  nextPortID: string;
  customPause: boolean;
  pausePortID?: string;
  previousPortID?: string;
  palette: HSLShades;
}

export const StreamStep: React.FC<StreamStepProps> = ({ audio, platform, customPause, nodeID, nextPortID, pausePortID, previousPortID, palette }) => {
  const isGoogle = Realtime.Utils.typeGuards.isGooglePlatform(platform);

  return (
    <Step nodeID={nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={audio}
          portID={isGoogle ? nextPortID : undefined}
          palette={palette}
          placeholder="Add an Audio file, URL or variable"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>

      {!isGoogle && (
        <Section>
          <Item icon="choice" palette={palette} label="Next" portID={nextPortID} />

          <Item label="Previous" portID={previousPortID} />

          {customPause && <Item label="Pause" portID={pausePortID} />}
        </Section>
      )}
    </Step>
  );
};

const ConnectedStreamStep: ConnectedStep<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = ({ ports, data, platform, palette }) => (
  <StreamStep
    audio={data.audio && transformVariablesToReadable(data.audio)}
    nodeID={data.nodeID}
    platform={platform}
    nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    pausePortID={ports.out.builtIn[BaseModels.PortType.PAUSE]}
    customPause={data.customPause}
    previousPortID={ports.out.builtIn[BaseModels.PortType.PREVIOUS]}
    palette={palette}
  />
);

export default ConnectedStreamStep;
