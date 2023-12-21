import { Switch } from '@voiceflow/ui';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { KBImportSitemapPreview } from './KBImportSitemapPreview/KBImportSitemapPreview.component';
import { KBImportSitemapURL } from './KBImportSitemapURL/KBImportSitemapURL.component';

export const KBImportSitemap = manager.create('KBImportSitemap', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [urls, setURLs] = useState('');
  const [screen, setScreen] = useState<'sitemap' | 'url-review'>('sitemap');
  const [sitemapURL, setSitemapURL] = useState('');

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
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
          />
        </Switch.Pane>

        <Switch.Pane value="url-review">
          <KBImportSitemapPreview
            urls={urls}
            onBack={() => setScreen('sitemap')}
            setURLs={setURLs}
            onClose={api.onClose}
            enableClose={api.enableClose}
            disableClose={api.preventClose}
            closePrevented={closePrevented}
          />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
