import type * as Realtime from '@voiceflow/realtime-sdk';
import { Thumbnail } from '@voiceflow/ui';
import React from 'react';

import Step from '@/pages/Canvas/components/Step';
import { DEFAULT_BY_KEY_PORT } from '@/pages/Canvas/constants';
import { FunctionMapContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { useMemoizedPropertyFilter } from '../../hooks/memoized-property-filter.hook';
import { useFunctionPathPortSync } from '../FunctionManager.hook';

export const FunctionStep: ConnectedStep<Realtime.NodeData.Function> = ({
  data,
  withPorts,
  ports,
  palette,
  isLast,
}) => {
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPaths = React.useMemo(() => Object.values(functionPathMap), [functionPathMap]);
  const { functionID } = data;
  const functionPathByFunctionID = useMemoizedPropertyFilter(functionPaths, { functionID: functionID ?? undefined }, [
    functionPaths,
    functionID,
  ]);
  const functionDef = functionID ? functionMap[functionID] : null;

  const nextPortID = ports.out.byKey[DEFAULT_BY_KEY_PORT];
  const paths = React.useMemo(() => {
    if (!functionID || !functionMap[functionID]?.pathOrder) return [];

    return functionMap[functionID].pathOrder.map((pathId) => {
      const path = functionPathMap[pathId];
      return {
        portID: ports.out.byKey[pathId],
        label: path.label || path.name,
      };
    });
  }, [functionPathByFunctionID, ports.out.byKey, functionID]);

  useFunctionPathPortSync(data.functionID, data.nodeID, ports, paths);

  const hasFunctions = Object.values(functionMap).length > 0;
  const hasPaths = !!paths.length;
  const emptyPlaceholder = hasFunctions ? 'Select function' : 'No function added';
  const descriptionPlaceholder = functionDef?.description || undefined;

  return (
    <Step nodeID={data.nodeID} dividerOffset={22}>
      <Step.Section v2>
        <Step.Item
          v2
          placeholder={!functionID ? emptyPlaceholder : descriptionPlaceholder}
          prefix={functionID ? <Thumbnail src={functionDef?.image} mr={16} /> : null}
          portID={isLast && !hasPaths ? nextPortID : null}
          icon={functionID ? undefined : 'systemCode'}
          label={functionDef?.description}
          palette={palette}
          title={functionDef?.name}
          multilineLabel
        />
      </Step.Section>

      {withPorts && hasPaths && (
        <Step.Section v2>
          {paths.map((path) => (
            <Step.Item
              v2
              key={path.portID}
              label={path.label}
              placeholder="Enter path name"
              portID={path.portID}
              multilineLabel
            />
          ))}
        </Step.Section>
      )}
    </Step>
  );
};
