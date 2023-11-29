import { Switch } from '@voiceflow/ui';
import React from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { useURLs } from '../Import.hook';
import { ImportSitemapScreen } from './ImportSitemap.constant';
import { SitemapURL } from './screens/SitemapURL.component';
import { URLReview } from './screens/URLReview.component';

interface ImportSitemapProps {
  onSave: (urls: string[]) => Promise<void> | void;
}

export const ImportSitemap = manager.create<ImportSitemapProps>('KBImportSitemap', () => ({ onSave, api, type, opened, hidden, animated }) => {
  const [screen, setScreen] = React.useState<ImportSitemapScreen>(ImportSitemapScreen.SITEMAP);
  const urlAPI = useURLs();
  const { urls, errors, validate, setUrls, disabled } = urlAPI;

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Switch active={screen}>
        <Switch.Pane value={ImportSitemapScreen.SITEMAP}>
          <SitemapURL validate={validate} setUrls={setUrls} onClose={api.close} onContinue={() => setScreen(ImportSitemapScreen.REVIEW_URLS)} />
        </Switch.Pane>

        <Switch.Pane value={ImportSitemapScreen.REVIEW_URLS}>
          <URLReview urls={urls} errors={errors} validate={validate} setUrls={setUrls} disabled={disabled} onClose={api.close} onSave={onSave} />
        </Switch.Pane>
      </Switch>
    </Modal.Container>
  );
});
