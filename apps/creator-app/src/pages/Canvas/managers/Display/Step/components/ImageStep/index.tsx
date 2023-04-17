import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../../../constants';
import { getLabel } from './utils';

export interface ImageStepProps {
  image: string | null;
  label: string | null;
  nodeID: string;
  nextPortID?: string;
  aspectRatio: number | null;
  palette: HSLShades;
}

const ConnectedImageStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const label = getLabel(data);

  return (
    <Step nodeID={data.nodeID} image={data.imageURL} imagePosition="top center">
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={label}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          placeholder="Add display title"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default ConnectedImageStep;
