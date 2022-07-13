import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Thumbnail } from '@voiceflow/ui';
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

export const ImageStep: React.FC<ImageStepProps> = ({ nodeID, image, nextPortID, aspectRatio, palette }) => {
  const stepAPI = React.useContext(Step.APIContext);

  const showPlaceholder = !image || isVariable(image);

  return (
    <Step nodeID={nodeID} image={showPlaceholder ? null : image} imageAspectRatio={aspectRatio} imagePosition="top center">
      {showPlaceholder && (
        <Item
          v2
          prefix={
            <Box mr={16}>
              <Thumbnail />
            </Box>
          }
          title="Image"
          portID={nextPortID}
          palette={palette}
          placeholder={image ? '' : 'Upload an image or GIF'}
        />
      )}

      {stepAPI?.withPorts && !showPlaceholder && nextPortID && (
        <PortEntityProvider id={nextPortID}>
          <Port.ImageContainer>
            <Port />
          </Port.ImageContainer>
        </PortEntityProvider>
      )}
    </Step>
  );
};

const ConnectedImageStep: ConnectedStep<BaseNode.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const label = getLabel(data);
  const size = data.device ? VoiceflowConstants.DEVICE_SIZE_MAP[data.device] : data.dimensions;

  return (
    <ImageStep
      label={label}
      image={data.image}
      nodeID={data.nodeID}
      palette={palette}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      aspectRatio={size ? size.width / size.height : null}
    />
  );
};

export default ConnectedImageStep;
