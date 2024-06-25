import { Switch } from '@voiceflow/ui';
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

export const KBManageIntegrations = manager.create(
  'KBManageIntegrations',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const [screen, setScreen] = React.useState<'integrations' | 'reconnect'>('integrations');
      const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);

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
                        icon={platform.icon}
                        date={createdAt}
                        border={index !== 0}
                        platform={platform.label}
                        disabled={closePrevented}
                        onRemoved={() => api.onClose()}
                        creatorID={creatorID}
                        onReconnect={() => setScreen('reconnect')}
                        enableClose={api.enableClose}
                        preventClose={api.preventClose}
                      />
                    );
                  })}
                </Box>

                <Modal.Footer>
                  <Modal.Footer.Button
                    label="Close"
                    variant="secondary"
                    onClick={api.onClose}
                    isLoading={closePrevented}
                    disabled={closePrevented}
                  />
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
    }
);
