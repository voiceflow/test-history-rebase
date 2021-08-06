import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  portID: string;
  toVariable: string | null;
  fromVariable: string | null;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, nodeID, portID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={
          fromVariable &&
          toVariable && (
            <>
              Capture <VariableLabel>{`{${fromVariable}}`}</VariableLabel> to <VariableLabel>{`{${toVariable}}`}</VariableLabel>
            </>
          )
        }
        icon={NODE_CONFIG.icon}
        portID={portID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedCaptureStep: React.FC<ConnectedStepProps<NodeData.Capture>> = ({ data, node }) => {
  const fromVariable = data.slot;
  const toVariable = data.variable;

  return <CaptureStep fromVariable={fromVariable} toVariable={toVariable} portID={node.ports.out[0]} {...data} />;
};

export default ConnectedCaptureStep;
