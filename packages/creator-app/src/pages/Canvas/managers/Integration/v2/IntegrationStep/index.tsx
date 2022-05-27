import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureStepItemV2, Item, Section, SuccessStepItemV2 } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG_V2 } from '../constants';
import { getDescriptions, getLabel } from '../utils';

export interface IntegrationStepProps {
  data: Realtime.NodeData.Integration;
  nodeID: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ data, withPorts, nodeID, successPortID, failurePortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section v2 withIcon>
      <Item
        icon={NODE_CONFIG_V2.getIcon!(data)}
        label={getLabel(data)}
        palette={palette}
        title={getDescriptions(data).title}
        placeholder={getDescriptions(data).label}
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
        labelLineClamp={2}
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

const ConnectedIntegrationStep: ConnectedStep<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => (
  <IntegrationStep
    data={data}
    nodeID={data.nodeID}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    palette={palette}
  />
);

export default ConnectedIntegrationStep;
