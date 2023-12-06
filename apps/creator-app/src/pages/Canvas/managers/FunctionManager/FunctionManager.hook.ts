import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FunctionMapContext, FunctionPathMapContext } from '@/pages/Canvas/contexts';
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

export const usePathNormalizer = (editor: NodeEditorV2Props<Realtime.NodeData.Function>) => {
  const functionPathMap = React.useContext(FunctionPathMapContext)!;
  const functionPathMapValues = Object.values(functionPathMap);
  const functionPathValuesByFunctionID = useMemoizedPropertyFilter(functionPathMapValues, { functionID: editor.data.functionID! });

  React.useEffect(() => {
    const portsOutKeys = Object.keys(editor.node.ports.out.byKey);
    const functionPathValuesByIDKeys = functionPathValuesByFunctionID.map(({ id }) => id);
    const portKeys = Array.from(new Set([...portsOutKeys, ...functionPathValuesByIDKeys]));

    portKeys.forEach((pathID) => {
      const shouldAdd = functionPathValuesByIDKeys.includes(pathID) && !portsOutKeys.includes(pathID);
      const shouldRemove = portsOutKeys.includes(pathID) && !functionPathValuesByIDKeys.includes(pathID);

      if (shouldAdd) {
        editor.engine.port.addByKey(editor.nodeID, pathID);
      }

      if (shouldRemove) {
        editor.engine.port.removeManyByKey([
          {
            key: pathID,
            portID: editor.node.ports.out.byKey[pathID],
          },
        ]);
      }
    });
  }, [editor.data.functionID]);
};
