import type { IconName } from '@voiceflow/icons';
import { Switch } from '@voiceflow/ui';
import { Box, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { KBImportIntegrationWaiting } from '../KnowledgeBaseImport/KBImportIntegration/KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBIntegration } from './KBIntegration/KBIntegration.component';
import { modalStyles } from './KnowledgeBaseManageIntegrations.css';

export const KBManageIntegrations = manager.create('KBManageIntegrations', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [screen, setScreen] = React.useState<'integrations' | 'reconnect'>('integrations');
  const INTEGRATIONS = [{ platform: 'Zendesk help center', icon: 'ZendeskColor', name: 'Ron Weasly', date: '2024-01-07T14:00:00.000Z' }];

  return (
    <Modal.Container
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      onEscClose={api.onEscClose}
      className={modalStyles}
    >
      <Scroll style={{ display: 'block' }}>
        <Switch active={screen}>
          <Switch.Pane value="integrations">
            <Modal.Header title="Manage integrations" onClose={api.onClose} />

            <Box py={20} pl={24} direction="column" gap={16}>
              {INTEGRATIONS.map(({ platform, icon, name, date }, index) => (
                <KBIntegration
                  key={platform}
                  platform={platform}
                  icon={icon as IconName}
                  name={name}
                  date={date}
                  border={index !== 0}
                  onReconnect={() => setScreen('reconnect')}
                />
              ))}
            </Box>

            <Modal.Footer>
              <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
            </Modal.Footer>
          </Switch.Pane>

          <Switch.Pane value="reconnect">
            <KBImportIntegrationWaiting onContinue={() => setScreen('integrations')} onClose={api.onClose} disabled={closePrevented} />
          </Switch.Pane>
        </Switch>
      </Scroll>
    </Modal.Container>
  );
});
