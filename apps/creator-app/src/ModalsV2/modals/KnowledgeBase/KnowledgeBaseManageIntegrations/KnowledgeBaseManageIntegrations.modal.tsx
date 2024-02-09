import { Switch, useDidUpdateEffect } from '@voiceflow/ui';
import { Box, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import manager from '@/ModalsV2/manager';

import { INTEGRATION_MANAGE_PLATFORMS_MAPPER } from '../KnowledgeBaseImport/KBImportIntegration/KBImportIntegrationPlatform/KBImportIntegrationPlatform.constant';
import { KBImportIntegrationWaiting } from '../KnowledgeBaseImport/KBImportIntegration/KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBIntegration } from './KBIntegration/KBIntegration.component';
import { modalStyles } from './KnowledgeBaseManageIntegrations.css';

export const KBManageIntegrations = manager.create('KBManageIntegrations', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [screen, setScreen] = React.useState<'integrations' | 'reconnect'>('integrations');
  const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);

  useDidUpdateEffect(() => {
    if (integrations.length === 0) {
      api.close();
    }
  }, [integrations]);

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
              {integrations.map(({ id, type, createdAt, creatorID }, index) => {
                const platform = INTEGRATION_MANAGE_PLATFORMS_MAPPER[type];
                return (
                  <KBIntegration
                    key={id}
                    type={type}
                    platform={platform.label}
                    icon={platform.icon}
                    creatorID={creatorID}
                    date={createdAt}
                    border={index !== 0}
                    onReconnect={() => setScreen('reconnect')}
                    onDelete={() => api.onClose()}
                  />
                );
              })}
            </Box>

            <Modal.Footer>
              <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} disabled={closePrevented} />
            </Modal.Footer>
          </Switch.Pane>

          <Switch.Pane value="reconnect">
            <KBImportIntegrationWaiting
              onFail={() => setScreen('integrations')}
              onClose={api.onClose}
              disabled={closePrevented}
              reconnect
              onContinue={() => setScreen('integrations')}
            />
          </Switch.Pane>
        </Switch>
      </Scroll>
    </Modal.Container>
  );
});
