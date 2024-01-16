import * as Realtime from '@voiceflow/realtime-sdk';
import { NodePortSchema } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import { EngineContext, FunctionMapContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { useMemoizedPropertyFilter } from '../hooks/memoized-property-filter.hook';
import { NodeEditorV2Props } from '../types';

export const useNameNormalizer = (editor: NodeEditorV2Props<Realtime.NodeData.Function>) => {
  const functionMap = React.useContext(FunctionMapContext)!;
  const functionData = getItemFromMap(functionMap, editor.data.functionID);

  React.useEffect(() => {
    editor.onChange({
      ...editor.data,
      name: functionData.name,
    });
  }, [editor.data.functionID]);
};

export const useFunctionPathPortSync = (functionID: string | null, nodeID: string, ports: NodePortSchema<string, any>, paths: any[] = []) => {
  const engine = React.useContext(EngineContext)!;
  const ignoreHistory = useDispatch(History.ignore);
  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPathMapValues = Object.values(functionPathMap);
  const functionPathValuesByFunctionID = useMemoizedPropertyFilter(functionPathMapValues, { functionID: functionID ?? '' });

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
          const shouldRemove = hasPort && !hasFunctionPath;

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
