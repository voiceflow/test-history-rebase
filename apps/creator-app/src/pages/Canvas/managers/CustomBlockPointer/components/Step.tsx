import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { CustomBlockMapContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

interface PointerStepProps {
  data: Realtime.NodeData<Realtime.NodeData.Pointer>;
  ports: Realtime.NodePorts<Realtime.BuiltInPortRecord<string>>;
  palette: HSLShades;
  withPorts: boolean;
  sourceBlock: Realtime.CustomBlock;
}

const PointerStep: React.FC<PointerStepProps> = ({ data, ports, palette, sourceBlock, withPorts }) => {
  const paths = React.useMemo(
    () =>
      sourceBlock.paths.map((pathname, index) => ({
        label: pathname,
        portID: ports.out.dynamic[index],
        isDefault: index === sourceBlock.defaultPath,
      })),
    [sourceBlock.paths, ports.out.dynamic, sourceBlock.defaultPath]
  );

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon="customBlock"
          label={sourceBlock.name || 'Unnamed Custom Block'}
          palette={palette}
          labelVariant={StepLabelVariant.PRIMARY}
          multilineLabel
        />
      </Section>

      {withPorts && paths.length > 0 && (
        <Section>
          {paths.map((path) => (
            <Item
              key={path.portID}
              label={path.label}
              placeholder="Enter path name"
              portID={path.portID}
              multilineLabel
            />
          ))}
        </Section>
      )}
    </Step>
  );
};

const NullPointerStep: React.FC<Omit<PointerStepProps, 'sourceBlock'>> = ({ data, ports, palette }) => (
  <Step nodeID={data.nodeID}>
    <Section>
      <Item
        icon="warning"
        portID={ports.out.dynamic[0]}
        palette={palette}
        placeholder="Custom block was deleted"
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
      />
    </Section>
  </Step>
);

const ConnectedPointerStep: ConnectedStep<Realtime.NodeData.Pointer> = (props) => {
  const customBlockMap = React.useContext(CustomBlockMapContext);

  const sourceBlock = customBlockMap?.[props.data.sourceID];

  return !sourceBlock ? <NullPointerStep {...props} /> : <PointerStep sourceBlock={sourceBlock} {...props} />;
};

export default ConnectedPointerStep;
