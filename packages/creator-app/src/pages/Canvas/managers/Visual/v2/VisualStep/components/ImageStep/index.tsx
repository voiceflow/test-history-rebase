import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { HSLShades } from '@/constants';
import Port from '@/pages/Canvas/components/Port';
import Step, { Item } from '@/pages/Canvas/components/Step';
import { PortEntityProvider } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { getLabel } from '@/pages/Canvas/managers/Visual/utils';
import { isVariable } from '@/utils/slot';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  nodeID: string;
  nextPortID?: string;
  aspectRatio: number | null;
  palette: HSLShades;
}

export const ImageStep: React.FC<ImageStepProps> = ({ nodeID, image, nextPortID, aspectRatio, palette }) => (
  <Step nodeID={nodeID} image={image} imageAspectRatio={aspectRatio} imagePosition="top center">
    {!image && (
      <Item
        icon="display"
        iconSize={30}
        iconStyle={{
          position: 'relative',
          top: '10px',
        }}
        title="Image"
        image={image}
        portID={nextPortID}
        palette={palette}
        placeholder="Upload an image or GIF"
      />
    )}

    {image && nextPortID && (
      <PortEntityProvider id={nextPortID}>
        <Port.ImageContainer>
          <Port />
        </Port.ImageContainer>
      </PortEntityProvider>
    )}
  </Step>
);

const ConnectedImageStep: ConnectedStep<BaseNode.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const label = getLabel(data);
  const size = data.device ? VoiceflowConstants.DEVICE_SIZE_MAP[data.device] : data.dimensions;
  const image = isVariable(data.image) ? null : data.image;

  const aspectRatio = size && data.canvasVisibility === BaseNode.Visual.CanvasVisibility.FULL ? size.width / size.height : null;

  return (
    <ImageStep
      label={label}
      image={data.canvasVisibility === BaseNode.Visual.CanvasVisibility.HIDDEN ? null : image}
      nodeID={data.nodeID}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      aspectRatio={aspectRatio}
      palette={palette}
    />
  );
};

export default ConnectedImageStep;
