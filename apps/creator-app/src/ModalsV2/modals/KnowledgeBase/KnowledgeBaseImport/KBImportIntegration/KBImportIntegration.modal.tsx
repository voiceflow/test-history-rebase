import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { useTrackingEvents } from '@/hooks/tracking';
import manager from '@/ModalsV2/manager';

import { KBImportIntegrationPlatform } from './KBImportIntegrationPlatform/KBImportIntegrationPlatform.component';
import { KBImportIntegrationWaiting } from './KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBImportIntegrationZendesk } from './KBImportIntegrationZendesk/KBImportIntegrationZendesk.component';

export const KBImportIntegration = manager.create(
  'KBImportIntegration',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const TEST_ID = tid('knowledge-base', 'import-integration-modal');

      const [screen, setScreen] = useState<'select-platform' | 'authenticate' | BaseModels.Project.IntegrationTypes>(
        'select-platform'
      );
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
        trackingEvents.trackAiKnowledgeBaseIntegrationSelected({ IntegrationType: platform });

        setSubdomain(subdomain);

        if (authenticate) {
          setScreen('authenticate');
        } else {
          setScreen(platform);
        }
      };

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          testID={TEST_ID}
        >
          <Switch active={screen}>
            <Switch.Pane value="select-platform">
              <KBImportIntegrationPlatform
                onClose={api.onClose}
                disabled={closePrevented}
                onContinue={onPlatformContinue}
                testID={TEST_ID}
              />
            </Switch.Pane>

            <Switch.Pane value="authenticate">
              <KBImportIntegrationWaiting
                onFail={() => setScreen('select-platform')}
                onClose={api.onClose}
                disabled={closePrevented}
                subdomain={subdomain}
                onContinue={() => setScreen(BaseModels.Project.IntegrationTypes.ZENDESK)}
                testID={TEST_ID}
              />
            </Switch.Pane>

            <Switch.Pane value={BaseModels.Project.IntegrationTypes.ZENDESK}>
              <KBImportIntegrationZendesk
                onClose={api.onClose}
                disabled={closePrevented}
                onSuccess={() => api.resolve()}
                enableClose={api.enableClose}
                disableClose={api.preventClose}
                testID={TEST_ID}
              />
            </Switch.Pane>
          </Switch>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
