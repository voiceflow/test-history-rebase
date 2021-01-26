import { DEVICE_SIZE_MAP } from '@voiceflow/general-types';
import { CanvasVisibility } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable } from '@/utils/slot';

import { getLabel } from './utils';

export type VisualStepProps = {
  image: string | null;
  label: string | null;
  portID?: string;
  aspectRatio: number | null;
};

export const VisualStep: React.FC<VisualStepProps> = ({ label, portID, image, aspectRatio }) => (
  <Step image={image} imageAspectRatio={aspectRatio} imagePosition="top center">
    <Section>
      <Item
        icon="display"
        label={label}
        portID={portID}
        iconColor="#3C6997"
        placeholder="Add visual mockup"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedVisualStep: React.FC<ConnectedStepProps<NodeData.Visual>> = ({ node, data }) => {
  const label = getLabel(data);
  const size = data.device ? DEVICE_SIZE_MAP[data.device] : data.dimensions;
  const image = isVariable(data.image) ? null : data.image;
  const aspectRatio = size && data.canvasVisibility === CanvasVisibility.FULL ? size.width / size.height : null;

  return <VisualStep portID={node.ports.out[0]} label={label} image={image} aspectRatio={aspectRatio} />;
};

export default ConnectedVisualStep;
