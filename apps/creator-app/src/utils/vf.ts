import { datadogRum } from '@datadog/browser-rum';
import { DataTypes, download, LOGROCKET_ENABLED, toast } from '@voiceflow/ui';
import dayjs from 'dayjs';

import client from '@/client';
import { designerClient } from '@/client/designer';
import * as LogRocket from '@/vendors/logrocket';

export const downloadVF = async ({
  time = Date.now(),
  name,
  versionID,
  realtimeExport,
}: {
  time?: number;
  name?: string;
  versionID: string;
  realtimeExport: boolean;
}) => {
  try {
    const timestamp = time ? `-${dayjs(time).format('YYYY-MM-DD_HH-mm')}` : '';

    const data = await (realtimeExport ? designerClient.assistant.exportJSON(versionID) : client.api.version.export(versionID));

    download(`${(name || versionID).replace(/\s/g, '_')}${timestamp}.vf`, JSON.stringify(data, null, 2), DataTypes.JSON);
  } catch (error) {
    if (LOGROCKET_ENABLED) {
      LogRocket.error(error);
    } else {
      datadogRum.addError(error);
    }
    toast.error('.VF export failed');
  }
};
