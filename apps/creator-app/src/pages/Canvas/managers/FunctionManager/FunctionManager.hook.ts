import { NodePortSchema } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import { EngineContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';

import { DEFAULT_BY_KEY_PORT } from '../../constants';
import { useMemoizedPropertyFilter } from '../hooks/memoized-property-filter.hook';

export const useFunctionPathPortSync = (
  functionID: string | null,
  nodeID: string,
  ports: NodePortSchema<string, any>,
  paths: any[] = []
) => {
  const engine = React.useContext(EngineContext)!;
  const ignoreHistory = useDispatch(History.ignore);
  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPathMapValues = React.useMemo(() => Object.values(functionPathMap), [functionPathMap]);
  const functionPathValuesByFunctionID = useMemoizedPropertyFilter(
    functionPathMapValues,
    { functionID: functionID ?? '' },
    [functionPathMapValues, functionID]
  );

  React.useEffect(() => {
    if (!functionID) return;
    const portsOutKeys = Object.keys(ports.out.byKey);
    const functionPathValuesByIDKeys = functionPathValuesByFunctionID.map(({ id }) => id);
    const portKeys = Array.from(new Set([...portsOutKeys, ...functionPathValuesByIDKeys]));

    ignoreHistory(() =>
      Promise.all(
        portKeys.flatMap((pathID) => {
          const hasPort = portsOutKeys.includes(pathID);
          const hasFunctionPath = functionPathValuesByIDKeys.includes(pathID);
          const shouldAdd = hasFunctionPath && !hasPort;
          const shouldRemove = pathID !== DEFAULT_BY_KEY_PORT && hasPort && !hasFunctionPath;

          return [
            ...(shouldAdd ? [engine.port.addByKey(nodeID, pathID)] : []),
            ...(shouldRemove
              ? [
                  engine.port.removeManyByKey([
                    {
                      key: pathID,
                      portID: ports.out.byKey[pathID],
                    },
                  ]),
                ]
              : []),
          ];
        })
      )
    );
  }, [paths.length, functionID]);
};
