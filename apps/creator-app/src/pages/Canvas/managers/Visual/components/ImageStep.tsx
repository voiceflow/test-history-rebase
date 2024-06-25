import type { BaseNode } from '@voiceflow/base-types';
import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Thumbnail } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Port from '@/pages/Canvas/components/Port';
import Step, { Item } from '@/pages/Canvas/components/Step';
import { PortEntityProvider } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable } from '@/utils/slot';

const ImageStep: ConnectedStep<BaseNode.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => {
  const stepAPI = React.useContext(Step.APIContext);

  const size = data.device ? VoiceflowConstants.DEVICE_SIZE_MAP[data.device] : data.dimensions;
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];
  const showPlaceholder = !data.image || isVariable(data.image);

  return (
    <Step
      nodeID={data.nodeID}
      image={showPlaceholder ? null : data.image}
      imageAspectRatio={size ? size.width / size.height : null}
      imagePosition="top center"
    >
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
          placeholder={data.image ? '' : 'Upload an image or GIF'}
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

export default ImageStep;
