import { datadogRum } from '@datadog/browser-rum';
import { DataTypes, download, toast } from '@voiceflow/ui';
import dayjs from 'dayjs';

import { designerClient } from '@/client/designer';

export const downloadVF = async ({ time = Date.now(), name, versionID }: { time?: number; name?: string; versionID: string }) => {
  try {
    const timestamp = time ? `-${dayjs(time).format('YYYY-MM-DD_HH-mm')}` : '';

    const data = await designerClient.assistant.exportJSON(versionID);

    download(`${(name || versionID).replace(/\s/g, '_')}${timestamp}.vf`, JSON.stringify(data, null, 2), DataTypes.JSON);
  } catch (error) {
    datadogRum.addError(error);
    toast.error('.VF export failed');
  }
};
