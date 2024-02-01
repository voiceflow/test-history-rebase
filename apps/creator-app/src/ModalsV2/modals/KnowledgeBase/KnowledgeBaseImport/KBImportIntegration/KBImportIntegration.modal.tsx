import { BaseModels } from '@voiceflow/base-types';
import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import * as Tracking from '@/ducks/tracking';
import manager from '@/ModalsV2/manager';

import { KBImportIntegrationPlatform } from './KBImportIntegrationPlatform/KBImportIntegrationPlatform.component';
import { KBImportIntegrationWaiting } from './KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBImportIntegrationZendesk } from './KBImportIntegrationZendesk/KBImportIntegrationZendesk.component';

export const KBImportIntegration = manager.create('KBImportIntegration', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [platform, setPlatform] = useState<BaseModels.Project.IntegrationTypes | null>(null);
  const [screen, setScreen] = useState<'platform' | 'authenticate' | 'zendesk'>('platform');

  Tracking.trackAiKnowledgeBaseIntegrationSelected({ IntegrationType: 'zendesk' });

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
      <Switch active={screen}>
        <Switch.Pane value="platform">
          <KBImportIntegrationPlatform
            platform={platform}
            setPlatform={setPlatform}
            onContinue={() => setScreen('authenticate')}
            onClose={api.onClose}
            disabled={closePrevented}
          />
        </Switch.Pane>

        <Switch.Pane value="authenticate">
          <KBImportIntegrationWaiting onContinue={() => setScreen('zendesk')} onClose={api.onClose} disabled={closePrevented} />
        </Switch.Pane>

        <Switch.Pane value="zendesk">
          <KBImportIntegrationZendesk onClose={api.onClose} enableClose={api.enableClose} disableClose={api.preventClose} disabled={closePrevented} />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
