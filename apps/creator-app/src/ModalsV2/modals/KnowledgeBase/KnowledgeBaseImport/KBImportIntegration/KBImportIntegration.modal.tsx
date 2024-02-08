import { BaseModels } from '@voiceflow/base-types';
import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { useTrackingEvents } from '@/hooks/tracking';
import manager from '@/ModalsV2/manager';

import { KBImportIntegrationPlatform } from './KBImportIntegrationPlatform/KBImportIntegrationPlatform.component';
import { KBImportIntegrationWaiting } from './KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBImportIntegrationZendesk } from './KBImportIntegrationZendesk/KBImportIntegrationZendesk.component';

export const KBImportIntegration = manager.create('KBImportIntegration', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [screen, setScreen] = useState<'platform' | 'authenticate' | BaseModels.Project.IntegrationTypes>('platform');
  const [trackingEvents] = useTrackingEvents();
  const [subdomain, setSubdomain] = useState<string | undefined>();

  const onPlatformContinue = ({
    platform,
    subdomain,
    authenticate,
  }: {
    platform: BaseModels.Project.IntegrationTypes;
    subdomain?: string;
    authenticate: boolean;
  }) => {
    setSubdomain(subdomain);

    if (authenticate) {
      setScreen('authenticate');
    } else {
      setScreen(platform);
    }

    trackingEvents.trackAiKnowledgeBaseIntegrationSelected({ IntegrationType: 'zendesk' });
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
      <Switch active={screen}>
        <Switch.Pane value="platform">
          <KBImportIntegrationPlatform onClose={api.onClose} disabled={closePrevented} onContinue={onPlatformContinue} />
        </Switch.Pane>

        <Switch.Pane value="authenticate">
          <KBImportIntegrationWaiting
            onFail={() => setScreen('platform')}
            onClose={api.onClose}
            disabled={closePrevented}
            subdomain={subdomain}
            onContinue={() => setScreen(BaseModels.Project.IntegrationTypes.ZENDESK)}
          />
        </Switch.Pane>

        <Switch.Pane value={BaseModels.Project.IntegrationTypes.ZENDESK}>
          <KBImportIntegrationZendesk onClose={api.onClose} enableClose={api.enableClose} disableClose={api.preventClose} disabled={closePrevented} />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
