import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { KBImportIntegrationPlatform } from './KBImportIntegrationPlatform/KBImportIntegrationPlatform.component';
import { KBImportPlatformType } from './KBImportIntegrationPlatform/KBImportIntegrationPlatform.constant';

export const KBImportIntegration = manager.create('KBImportIntegration', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [platform, setPlatform] = useState<KBImportPlatformType | null>(null);
  const [screen, setScreen] = useState<'platform' | 'zendesk'>('platform');

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
      <Switch active={screen}>
        <Switch.Pane value="platform">
          <KBImportIntegrationPlatform
            platform={platform}
            setPlatform={setPlatform}
            onContinue={() => setScreen('zendesk')}
            onClose={api.onClose}
            disabled={closePrevented}
          />
        </Switch.Pane>

        <Switch.Pane value="zendesk">
          <KBImportIntegrationPlatform
            platform={platform}
            setPlatform={setPlatform}
            onContinue={() => setScreen('platform')}
            onClose={api.onClose}
            disabled={closePrevented}
          />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
