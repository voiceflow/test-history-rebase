import { Switch } from '@voiceflow/ui';
import { Box, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import manager from '@/ModalsV2/manager';
import { KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

import { INTEGRATION_PLATFORMS_MAPPER } from '../KnowledgeBaseImport/KBImportIntegration/KBImportIntegrationPlatform/KBImportIntegrationPlatform.constant';
import { KBImportIntegrationWaiting } from '../KnowledgeBaseImport/KBImportIntegration/KBImportIntegrationWaiting/KBImportIntegrationWaiting.component';
import { KBIntegration } from './KBIntegration/KBIntegration.component';
import { modalStyles } from './KnowledgeBaseManageIntegrations.css';

export const KBManageIntegrations = manager.create('KBManageIntegrations', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [screen, setScreen] = React.useState<'integrations' | 'reconnect'>('integrations');
  const [integrations, setIntegrations] = React.useState<KnowledgeBaseIntegration[]>([]);

  const getAll = useDispatch(Designer.KnowledgeBase.Integration.effect.getAll);

  const getIntegrations = async () => {
    setIntegrations(await getAll());
  };

  React.useEffect(() => {
    getIntegrations();
  }, [getAll]);

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
              {integrations.map(({ id, type, creatorName, createdAt }, index) => {
                const platform = INTEGRATION_PLATFORMS_MAPPER[type];
                return (
                  <KBIntegration
                    key={id}
                    type={type}
                    platform={platform.label}
                    icon={platform.icon}
                    name={creatorName}
                    date={createdAt}
                    border={index !== 0}
                    onReconnect={() => setScreen('reconnect')}
                  />
                );
              })}
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
