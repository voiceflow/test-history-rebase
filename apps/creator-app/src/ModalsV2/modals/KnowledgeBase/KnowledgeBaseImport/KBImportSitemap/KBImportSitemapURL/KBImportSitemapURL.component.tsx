import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Scroll, TextField } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { HTTPS_URL_REGEX } from '@/constants';
import { Designer } from '@/ducks';
import { useDispatch, useFeature } from '@/hooks';

import { KBRefreshRateSelect } from '../../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { sanitizeURL } from '../../KnowledgeBaseImport.utils';
import { submitButtonStyles } from '../KBImportSitemap.css';
import { IKBImportSitemapURL } from './KBImportSitemapURL.interface';

export const KBImportSitemapURL: React.FC<IKBImportSitemapURL> = ({
  addURLs,
  onClose,
  sitemapURL,
  refreshRate,
  setRefreshRate,
  onContinue: onContinueProp,
  enableClose,
  disableClose,
  setSitemapURL,
  closePrevented,
}) => {
  const getURLsFromSitemap = useDispatch(Designer.KnowledgeBase.Document.effect.getURLsFromSitemap);
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);

  const [error, setError] = useState('');

  const onContinue = async () => {
    if (!sitemapURL) {
      setError('Sitemap URL is required.');
      return;
    }

    const sanitizedSitemapURL = sanitizeURL(sitemapURL);

    if (!sanitizedSitemapURL.match(HTTPS_URL_REGEX)) {
      setError('Invalid sitemap URL.');
      return;
    }

    try {
      disableClose();

      const newURLs = await getURLsFromSitemap(sitemapURL);

      if (!newURLs.length) {
        setError('No URLs found in sitemap.');
        return;
      }

      addURLs(newURLs);
      onContinueProp();
    } catch {
      setError('Unable to fetch sitemap.');
    } finally {
      enableClose();
    }
  };

  const onChangeSitemapValue = (value: string) => {
    setError('');
    setSitemapURL(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onContinue();
    }
  };

  return (
    <>
      <Modal.Header title="Import from sitemap" onClose={onClose} />

      <Scroll style={{ display: 'block' }}>
        <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
          <Box direction="column">
            <TextField
              label="Sitemap URL"
              error={!!error}
              value={sitemapURL}
              caption={!error ? 'e.g. https://www.domain.com/sitemap.xml' : undefined}
              autoFocus
              disabled={closePrevented}
              placeholder="Enter sitemap URL"
              errorMessage={error}
              onValueChange={onChangeSitemapValue}
              onKeyDown={onKeyDown}
            />
          </Box>

          {isRefreshEnabled && <KBRefreshRateSelect value={refreshRate} disabled={closePrevented} onValueChange={setRefreshRate} />}
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={closePrevented} />

        <Modal.Footer.Button
          label="Continue"
          onClick={onContinue}
          disabled={closePrevented}
          isLoading={closePrevented}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </>
  );
};
