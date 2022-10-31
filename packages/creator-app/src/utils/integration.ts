import * as Realtime from '@voiceflow/realtime-sdk';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';

const keyValToDB = ({ index, key, val }: { index?: number; key: string; val: string }) => ({
  index,
  key: textEditorContentAdapter.toDB(key),
  val: textEditorContentAdapter.toDB(val),
});

export const encodeCustomAPIData = (data: Realtime.NodeData.CustomApi) => {
  const { selectedAction, bodyInputType, body, url, headers, mapping, parameters, content, tls } = data;
  return {
    bodyInputType,
    body: body?.map(keyValToDB) ?? [],
    selected_action: selectedAction,
    url: textEditorContentAdapter.toDB(url ?? ''),
    headers: headers?.map(keyValToDB) ?? [],
    mapping:
      mapping?.map(({ index, path, var: varVal }) => ({
        index,
        path: textEditorContentAdapter.toDB(path),
        var: varVal,
      })) ?? [],
    method: selectedAction?.split(' ')[2] ?? '',
    params: parameters?.map(keyValToDB) ?? [],
    content,
    tls,
  };
};
