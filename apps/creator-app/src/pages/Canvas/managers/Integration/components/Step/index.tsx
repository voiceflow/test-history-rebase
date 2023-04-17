import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureStepItemV2, Item, Section, SuccessStepItemV2 } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../../constants';
import { getDescriptions, getLabel } from './utils';

const IntegrationStep: ConnectedStep<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => (
  <Step nodeID={data.nodeID}>
    <Section v2 withIcon>
      <Item
        v2
        icon={NODE_CONFIG.getIcon!(data)}
        label={getLabel(data)}
        title={getDescriptions(data).title}
        palette={palette}
        placeholder={getDescriptions(data).label}
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
        labelLineClamp={2}
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

export default IntegrationStep;
