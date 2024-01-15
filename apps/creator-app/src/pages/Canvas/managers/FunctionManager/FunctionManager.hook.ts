import * as Realtime from '@voiceflow/realtime-sdk';
import { NodePortSchema } from '@voiceflow/realtime-sdk';
import React from 'react';

import { EngineContext, FunctionMapContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';
import { getItemFromMap } from '@/pages/Canvas/utils';

import { DEFAULT_BY_KEY_PORT } from '../../constants';
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

  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPathMapValues = Object.values(functionPathMap);
  const functionPathValuesByFunctionID = useMemoizedPropertyFilter(functionPathMapValues, { functionID });

  React.useEffect(() => {
    if (!functionID) return;
    const portsOutKeys = Object.keys(ports.out.byKey);
    const functionPathValuesByIDKeys = functionPathValuesByFunctionID.map(({ id }) => id);
    const portKeys = Array.from(new Set([...portsOutKeys, ...functionPathValuesByIDKeys]));

    portKeys.forEach((pathID) => {
      const shouldAdd = functionPathValuesByIDKeys.includes(pathID) && !portsOutKeys.includes(pathID);
      const shouldRemove = pathID !== DEFAULT_BY_KEY_PORT && portsOutKeys.includes(pathID) && !functionPathValuesByIDKeys.includes(pathID);

      if (shouldAdd) {
        engine.port.addByKey(nodeID, pathID);
      }

      if (shouldRemove) {
        engine.port.removeManyByKey([
          {
            key: pathID,
            portID: ports.out.byKey[pathID],
          },
        ]);
      }
    });
  }, [paths?.length]);
};
