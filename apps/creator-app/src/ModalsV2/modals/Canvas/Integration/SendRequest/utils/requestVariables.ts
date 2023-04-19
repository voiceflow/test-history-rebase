import { deepDraftToMarkdown } from '@/pages/Canvas/managers/Integration/components/ZapierAndGoogleEditor/components/utils';
import { encodeCustomAPIData } from '@/utils/integration';

export const normalize = (data: any) => {
  const dataCreatorAPIFormat = encodeCustomAPIData(data);

  // this is the format used on a rendered diagram on voiceflow-server
  return deepDraftToMarkdown(dataCreatorAPIFormat).result;
};
