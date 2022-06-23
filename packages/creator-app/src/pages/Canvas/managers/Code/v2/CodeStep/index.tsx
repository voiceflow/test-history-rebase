import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import Step, { FailureStepItemV2, Item, Section, StepButton, SuccessStepItemV2 } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import CodePreview from '../CodePreview';
import { CODE_STEP_ICON } from '../constants';

export interface CodeStepProps {
  nodeID: string;
  codeData: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
  onOpenEditor: () => void;
}

export const CodeStep: React.FC<CodeStepProps> = ({ codeData, withPorts, nodeID, successPortID, failurePortID, onOpenEditor, palette }) => {
  const hasCode = codeData?.length > 0;

  return (
    <Step nodeID={nodeID}>
      <Section v2 withIcon>
        <Item
          icon={CODE_STEP_ICON}
          palette={palette}
          label={hasCode ? 'Custom code' : null}
          placeholder="Add custom code"
          attachment={
            hasCode && (
              <Popper
                placement="right-start"
                borderRadius="8px"
                renderContent={({ onClose }) => <CodePreview codeData={codeData} onClose={onClose} onOpenEditor={onOpenEditor} />}
              >
                {({ onToggle, ref, isOpened }) => <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="preview" isActive={isOpened} />}
              </Popper>
            )
          }
          v2
        />
        {withPorts && (
          <>
            <SuccessStepItemV2 label="Success" portID={successPortID} />
            <FailureStepItemV2 label="Fail" portID={failurePortID} />
          </>
        )}
      </Section>
    </Step>
  );
};

const ConnectedCodeStep: ConnectedStep<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
  engine,
}) => (
  <CodeStep
    nodeID={data.nodeID}
    codeData={data.code}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    palette={palette}
    onOpenEditor={() => engine.setActive(data.nodeID)}
  />
);

export default ConnectedCodeStep;
