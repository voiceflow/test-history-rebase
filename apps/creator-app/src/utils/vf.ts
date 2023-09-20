import { datadogRum } from '@datadog/browser-rum';
import { DataTypes, download } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import dayjs from 'dayjs';

import client from '@/client';

export const downloadVF = async (versionID: string, name: string, time: number | string | null = Date.now()) => {
  try {
    const timestamp = time ? `-${dayjs(time).format('YYYY-MM-DD_HH-mm')}` : '';

    const data = await client.api.version.export(versionID);
    download(`${name?.replace(/\s/g, '_')}${timestamp}.vf`, JSON.stringify(data, null, 2), DataTypes.JSON);
  } catch (error) {
    datadogRum.addError(error);
    toast.error('.VF export failed');
  }
};
