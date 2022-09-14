import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Step, { FailureStepItemV2, Item, Section, StepButton, SuccessStepItemV2 } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';
import StepPreview from './StepPreview';

const CodeStep: ConnectedStep<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ ports, data, withPorts, palette, engine }) => (
  <Step nodeID={data.nodeID}>
    <Section v2 withIcon>
      <Item
        icon={NODE_CONFIG.icon}
        label={data.code ? 'Javascript' : null}
        palette={palette}
        placeholder="Add javascript"
        attachment={
          !!data.code && (
            <Popper
              placement="right-start"
              renderContent={({ onClose }) => (
                <StepPreview codeData={data.code} onClose={onClose} onOpenEditor={() => engine.setActive(data.nodeID)} />
              )}
            >
              {({ onToggle, ref, isOpened }) => <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="preview" isActive={isOpened} />}
            </Popper>
          )
        }
        v2
      />

      {withPorts && (
        <>
          <SuccessStepItemV2 label="Success" portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />

          <FailureStepItemV2 label="Fail" portID={ports.out.builtIn[BaseModels.PortType.FAIL]} />
        </>
      )}
    </Section>
  </Step>
);

export default CodeStep;
