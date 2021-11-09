import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { usePortFilter } from '@/pages/Canvas/hooks';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface StreamStepProps {
  audio: string;
  platform: Constants.PlatformType;
  customPause: boolean;
  nodeID: string;
  portIDs: string[];
}

export const StreamStep: React.FC<StreamStepProps> = ({ audio, platform, customPause, nodeID, portIDs }) => {
  const isGoogle = platform === Constants.PlatformType.GOOGLE;
  const [nextPortID, previousPortID, pausePortID] = portIDs;

  return (
    <Step nodeID={nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          iconColor={NODE_CONFIG.iconColor}
          label={audio}
          placeholder="Add an Audio file, URL or variable"
          labelVariant={StepLabelVariant.SECONDARY}
          portID={isGoogle ? nextPortID : undefined}
        />
      </Section>

      {!isGoogle && (
        <Section>
          <Item icon="choice" iconColor="#3a5999" label="Next" portID={nextPortID} />
          <Item label="Previous" portID={previousPortID} />
          {customPause && <Item label="Pause" portID={pausePortID} />}
        </Section>
      )}
    </Step>
  );
};

const ConnectedStreamStep: React.FC<ConnectedStepProps<Realtime.NodeData.Stream>> = ({ node, data, platform }) => {
  const portFilter = usePortFilter();

  return (
    <StreamStep
      audio={data.audio && transformVariablesToReadable(data.audio)}
      customPause={data.customPause}
      nodeID={node.id}
      portIDs={node.ports.out.filter(portFilter)}
      platform={platform}
    />
  );
};

export default ConnectedStreamStep;
