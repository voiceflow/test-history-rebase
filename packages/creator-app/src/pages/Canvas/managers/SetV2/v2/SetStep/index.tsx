import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

export interface SetStepProps {
  title?: string;
  nodeID: string;
  nextPortID: string;
  palette: HSLShades;
}

export const SetStep: React.FC<SetStepProps> = ({ title, nodeID, nextPortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon="systemSet"
        label={title || ''}
        portID={nextPortID}
        palette={palette}
        placeholder="Add set label"
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
      />
    </Section>
  </Step>
);

const ConnectedSetStep: ConnectedStep<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ ports, data, palette }) => (
  <SetStep title={data.title} nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} palette={palette} />
);

export default ConnectedSetStep;
