import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

export type CaptureStepProps = {
  portID: string;
  fromVariable?: string;
  toVariable?: string;
};

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, portID }) => (
  <Step>
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
        labelVariant={StepLabelVariant.SECONDARY}
        portID={portID}
        icon="microphone"
        iconColor="#58457a"
        placeholder="Capture a user response"
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
