import { Models, Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable } from '@/utils/slot';

import { NODE_CONFIG } from '../../../constants';
import { getLabel } from './utils';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  nodeID: string;
  nextPortID?: string;
  aspectRatio: number | null;
  variant: BlockVariant;
}

export const ImageStep: React.FC<ImageStepProps> = ({ label, nodeID, image, nextPortID, aspectRatio, variant }) => (
  <Step nodeID={nodeID} image={image} imageAspectRatio={aspectRatio} imagePosition="top center">
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        variant={variant}
        placeholder="Add a visual"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedImageStep: ConnectedStep<Node.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ node, data, variant }) => {
  const label = getLabel(data);
  const size = data.device ? Constants.DEVICE_SIZE_MAP[data.device] : data.dimensions;
  const image = isVariable(data.image) ? null : data.image;

  const aspectRatio = size && data.canvasVisibility === Node.Visual.CanvasVisibility.FULL ? size.width / size.height : null;

  return (
    <ImageStep
      label={label}
      image={data.canvasVisibility === Node.Visual.CanvasVisibility.HIDDEN ? null : image}
      nodeID={node.id}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
      aspectRatio={aspectRatio}
      variant={variant}
    />
  );
};

export default ConnectedImageStep;
