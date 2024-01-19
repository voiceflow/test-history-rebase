import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../../../constants';

export interface APLStepProps {
  image?: string | null;
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
  palette: HSLShades;
}

const ConnectedAPLStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const label =
    data.aplType === BaseNode.Visual.APLType.SPLASH ? transformVariablesToReadable(data.title, entitiesAndVariables.byKey) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return (
    <Step nodeID={data.nodeID} image={image}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={label}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          placeholder="Add a multimodal display"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

export default ConnectedAPLStep;
