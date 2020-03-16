import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import { usePortFilter } from '@/pages/Canvas/components/PortSet/hooks';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

export type StreamStepProps = ConnectedStepProps['stepProps'] & {
  audio: string;
  platform: PlatformType;
  customPause: boolean;
  portIDs: string[];
};

export const StreamStep: React.FC<StreamStepProps> = ({ audio, platform, isActive, customPause, portIDs, onClick }) => {
  const isGoogle = platform === PlatformType.GOOGLE;
  const [nextPortID, previousPortID, pausePortID] = portIDs;

  return (
    <Step isActive={isActive} onClick={onClick}>
      <Section>
        <Item
          icon="audioPlayer"
          iconColor="#4f98c6"
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

const ConnectedStreamStep: React.FC<ConnectedStepProps<NodeData.Stream>> = ({ node, data, platform, stepProps }) => {
  const portFilter = usePortFilter();

  return (
    <StreamStep
      audio={transformVariablesToReadable(data.audio)}
      customPause={data.customPause}
      portIDs={node.ports.out.filter(portFilter)}
      platform={platform}
      {...stepProps}
    />
  );
};

export default ConnectedStreamStep;
