import type * as Realtime from '@voiceflow/realtime-sdk';

import { transformVariablesFromReadableWithoutTrim } from '@/utils/slot';

export const encodeCustomAPIData = (data: Realtime.NodeData.CustomApi) => {
  const { selectedAction, bodyInputType, body, url, headers, mapping, parameters, content, tls } = data;

  return {
    bodyInputType,
    body: body ?? [],
    selected_action: selectedAction,
    url: url ?? '',
    headers: headers ?? [],
    mapping:
      mapping?.map(({ index, path, var: varVal }) => ({
        index,
        path,
        var: varVal,
      })) ?? [],
    method: selectedAction?.split(' ')[2] ?? '',
    params: parameters ?? [],
    content: transformVariablesFromReadableWithoutTrim(content),
    tls,
  };
};
