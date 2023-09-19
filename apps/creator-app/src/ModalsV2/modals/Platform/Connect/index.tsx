import * as Platform from '@voiceflow/platform-config';
import { Modal, usePersistFunction } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { SourceType } from '@/ducks/tracking/constants';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { ConnectingStage } from './components';
import { PlatformAccount } from './types';

export interface BaseConnectProps {
  source: SourceType;
  platform?: Platform.Constants.PlatformType;
}

const Connect = manager.create<BaseConnectProps, PlatformAccount>(
  'PlatformConnect',
  () =>
    ({ api, type, opened, hidden, animated, platform, source }) => {
      const activePlatform = useSelector(ProjectV2.active.platformSelector);
      const [trackingEvents] = useTrackingEvents();

      const platformConfig = Platform.Config.get(platform ?? activePlatform);

      const onSuccess = usePersistFunction((account: PlatformAccount) => {
        if (source) {
          trackingEvents.trackDeveloperAccountConnected({ platform: platformConfig.type, source });
        }

        toast.success(`${platformConfig.name} successfully connected`);

        api.resolve(account);
        api.close();
      });

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
          <ConnectingStage onClose={() => api.close()} onSuccess={onSuccess} platformConfig={platformConfig} />
        </Modal>
      );
    }
);

export default Connect;
