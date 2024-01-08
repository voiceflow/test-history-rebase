import * as Realtime from '@voiceflow/realtime-sdk';
import { Thumbnail } from '@voiceflow/ui';
import React from 'react';

import Step from '@/pages/Canvas/components/Step';
import { FunctionMapContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useMemoizedPropertyFilter } from '../../hooks/memoized-property-filter.hook';

export const FunctionStep: ConnectedStep<Realtime.NodeData.Function> = ({ data, withPorts, ports, palette }) => {
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPathByFunctionID = useMemoizedPropertyFilter(Object.values(functionPathMap), { functionID: data.functionID! });

  const hasFunctions = Object.values(functionMap).length > 0;
  const { functionID } = data;
  const { name, image } = getItemFromMap(functionMap, functionID);

  const paths = React.useMemo(
    () =>
      functionPathByFunctionID.map((path) => ({
        label: path.label || path.name,
        portID: ports.out.byKey[path.id],
      })),
    [functionPathByFunctionID, ports.out.byKey]
  );

  return (
    <Step nodeID={data.nodeID} dividerOffset={22}>
      <Step.Section v2>
        <Step.Item
          v2
          icon="systemCode"
          palette={palette}
          placeholder={hasFunctions ? 'Select function' : 'No function added'}
          withNewLines
          multilineLabel
          labelLineClamp={100}
        >
          {functionID && (
            <>
              <Thumbnail src={image} mr={16} />
              <Step.LabelText>{name}</Step.LabelText>
            </>
          )}
        </Step.Item>
      </Step.Section>

      {withPorts && (
        <Step.Section>
          {paths.map((path) => {
            return <Step.Item key={path.portID} label={path.label} placeholder="Enter path name" portID={path.portID} multilineLabel />;
          })}
        </Step.Section>
      )}
    </Step>
  );
};
