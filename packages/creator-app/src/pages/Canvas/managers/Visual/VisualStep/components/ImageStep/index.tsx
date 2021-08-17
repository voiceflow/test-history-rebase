import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable } from '@/utils/slot';

import { NODE_CONFIG } from '../../../constants';
import { getLabel } from './utils';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  nodeID: string;
  portID?: string;
  aspectRatio: number | null;
}

export const ImageStep: React.FC<ImageStepProps> = ({ label, nodeID, portID, image, aspectRatio }) => (
  <Step nodeID={nodeID} image={image} imageAspectRatio={aspectRatio} imagePosition="top center">
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={portID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Add a visual"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedImageStep: React.FC<ConnectedStepProps<Node.Visual.ImageStepData>> = ({ node, data }) => {
  const label = getLabel(data);
  const size = data.device ? Constants.DEVICE_SIZE_MAP[data.device] : data.dimensions;
  const image = isVariable(data.image) ? null : data.image;

  const aspectRatio = size && data.canvasVisibility === Node.Visual.CanvasVisibility.FULL ? size.width / size.height : null;

  return (
    <ImageStep
      nodeID={node.id}
      portID={node.ports.out[0]}
      label={label}
      image={data.canvasVisibility === Node.Visual.CanvasVisibility.HIDDEN ? null : image}
      aspectRatio={aspectRatio}
    />
  );
};

export default ConnectedImageStep;
