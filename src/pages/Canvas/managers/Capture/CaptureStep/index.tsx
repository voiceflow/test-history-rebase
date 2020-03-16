import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

export type CaptureStepProps = ConnectedStepProps['stepProps'] & {
  portID: string;
  fromVariable?: string;
  toVariable?: string;
};

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, portID, isActive, onClick, lockOwner, withPorts }) => (
  <Step isActive={isActive} onClick={onClick} lockOwner={lockOwner}>
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
        portID={withPorts ? portID : null}
        icon="microphone"
        iconColor="#58457a"
        placeholder="Capture a user response"
      />
    </Section>
  </Step>
);

const ConnectedCaptureStep: React.FC<ConnectedStepProps<NodeData.Capture>> = ({ data, node, stepProps }) => {
  const fromVariable = data.slot;
  const toVariable = data.variable;

  return <CaptureStep fromVariable={fromVariable} toVariable={toVariable} portID={node.ports.out[0]} {...data} {...stepProps} />;
};

export default ConnectedCaptureStep;
