import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { NodeData } from '@/models';

const keyValToDB = ({ index, key, val }: { index?: number; key: string; val: string }) => ({
  index,
  key: textEditorContentAdapter.toDB(key),
  val: textEditorContentAdapter.toDB(val),
});

// eslint-disable-next-line import/prefer-default-export
export const encodeCustomAPIData = (data: NodeData.CustomApi) => {
  const { selectedAction, bodyInputType, body, url, headers, mapping, parameters, content } = data;
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
  };
};
