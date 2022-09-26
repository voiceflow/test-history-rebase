import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as CustomBlock from '@/ducks/customBlock';
import { useSelector } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

interface Path {
  label: string;
  portID: string;
}

export interface PointerStepProps {
  nodeID: string;
  palette: HSLShades;
  label: string;
  paths: Path[];
  withPorts: boolean;
}

const PointerStep: React.FC<PointerStepProps> = ({ nodeID, label, palette, paths, withPorts }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="customBlock" label={label ?? 'Unnamed Custom Block'} palette={palette} labelVariant={StepLabelVariant.PRIMARY} multilineLabel />
    </Section>
    {paths.length > 0 && withPorts && (
      <Section>
        {paths.map((path) => {
          return <Item key={path.portID} label={path.label} placeholder="Enter path name" portID={path.portID} multilineLabel />;
        })}
      </Section>
    )}
  </Step>
);

export interface PointerStepManagerProps {
  palette: HSLShades;
  data: Realtime.NodeData<Realtime.NodeData.Pointer>;
  ports: Realtime.NodePorts<Realtime.BuiltInPortRecord<string>>;
  sourceBlock: Realtime.CustomBlock;
  withPorts: boolean;
}

const PointerStepManager: React.FC<PointerStepManagerProps> = ({ ports, data, palette, sourceBlock, ...restProps }) => {
  const paths = sourceBlock.paths.map((pathname, index) => ({
    label: pathname,
    isDefault: index === sourceBlock!.defaultPath,
    portID: ports.out.dynamic[index],
  }));

  return <PointerStep nodeID={data.nodeID} label={sourceBlock.name} palette={palette} paths={paths} {...restProps} />;
};

export type NullPointerStep = {
  ports: Realtime.NodePorts<Realtime.BuiltInPortRecord<string>>;
} & Pick<PointerStepProps, 'nodeID' | 'palette'>;

const NullPointerStep: React.FC<NullPointerStep> = ({ nodeID, palette, ports }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon="warning"
        placeholder="Custom block was deleted"
        palette={palette}
        labelVariant={StepLabelVariant.PRIMARY}
        portID={ports.out.dynamic[0]}
        multilineLabel
      />
    </Section>
  </Step>
);

export const ConnectedPointerStep: ConnectedStep<Realtime.NodeData.Pointer> = (props) => {
  const { data } = props;
  const sourceBlock = useSelector(CustomBlock.customBlockByIDSelector, { id: data.sourceID });
  return !sourceBlock ? <NullPointerStep nodeID={data.nodeID} {...props} /> : <PointerStepManager sourceBlock={sourceBlock} {...props} />;
};
