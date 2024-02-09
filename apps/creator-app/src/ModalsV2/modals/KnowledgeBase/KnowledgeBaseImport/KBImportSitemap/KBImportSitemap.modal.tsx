import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { KBImportSitemapPreview } from './KBImportSitemapPreview/KBImportSitemapPreview.component';
import { KBImportSitemapURL } from './KBImportSitemapURL/KBImportSitemapURL.component';

const TEST_ID = tid('knowledge-base', 'import-sitemap-modal');

export const KBImportSitemap = manager.create('KBImportSitemap', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [urls, setURLs] = useState('');
  const [screen, setScreen] = useState<'sitemap' | 'url-review'>('sitemap');
  const [sitemapURL, setSitemapURL] = useState('');
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);

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
        <Switch.Pane value="sitemap">
          <KBImportSitemapURL
            onClose={api.onClose}
            addURLs={(res) => setURLs(res.join('\n'))}
            sitemapURL={sitemapURL}
            onContinue={() => setScreen('url-review')}
            enableClose={api.enableClose}
            disableClose={api.preventClose}
            setSitemapURL={setSitemapURL}
            closePrevented={closePrevented}
            refreshRate={refreshRate}
            setRefreshRate={setRefreshRate}
            testID={TEST_ID}
          />
        </Switch.Pane>

        <Switch.Pane value="url-review">
          <KBImportSitemapPreview
            urls={urls}
            refreshRate={refreshRate}
            onBack={() => setScreen('sitemap')}
            setURLs={setURLs}
            onClose={api.onClose}
            enableClose={api.enableClose}
            disableClose={api.preventClose}
            closePrevented={closePrevented}
            testID={TEST_ID}
          />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
