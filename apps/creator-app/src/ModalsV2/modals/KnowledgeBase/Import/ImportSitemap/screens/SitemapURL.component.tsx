/* eslint-disable no-await-in-loop */
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import { HTTPS_URL_REGEX } from '@/constants';
import * as Session from '@/ducks/session';
import { useFeature, useSelector } from '@/hooks';

import { RefreshRateSelect } from '../../components/RefreshRateSelect/RefreshRateSelect.component';
import { appendURLs, sanitizeURL } from '../../Import.utils';
import { submitButtonStyles } from '../ImportSitemap.css';

interface SitemapURLProps {
  sitemapURL: string;
  closePrevented: boolean;
  enableClose: () => void;
  disableClose: () => void;
  setSitemapURL: React.Dispatch<React.SetStateAction<string>>;
  validate: () => boolean;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
  onClose: VoidFunction;
  onContinue: VoidFunction;
}

const CAPTION = `e.g. https://www.domain.com/sitemap.xml`;

export const SitemapURL: React.FC<SitemapURLProps> = ({
  sitemapURL,
  setSitemapURL,
  validate,
  setUrls,
  onClose,
  onContinue,
  closePrevented,
  enableClose,
  disableClose,
}) => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const [error, setError] = React.useState<string>('');
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const fetchSitemap = async (url: string, projectID: string): Promise<string[]> => {
    // always try the original url
    const urlsToTry: string[] = [url];

    if (!url.endsWith('.xml')) {
      url += url.endsWith('/') ? '' : '/';
      urlsToTry.push(`${url}sitemap.xml`);
      urlsToTry.push(`${url}sitemap_index.xml`);
      urlsToTry.push(`${url}sitemap/sitemap.xml`);
    }

    for (const sitemapURL of urlsToTry) {
      const { data: sites } = await client.apiV3.fetch
        .post<string[]>(`/projects/${projectID}/knowledge-base/sitemap`, { sitemapURL })
        .catch(() => ({ data: [] }));
      if (sites?.length) return sites;
    }
    return [];
  };

  const onNext = async () => {
    try {
      disableClose();
      if (!sitemapURL) throw new Error('Sitemap is required.');

      const sitemap = sanitizeURL(sitemapURL);
      if (!HTTPS_URL_REGEX.test(sitemap)) throw new Error('Invalid sitemap URL.');

      const sites = await fetchSitemap(sitemapURL, projectID);
      if (!sites?.length) throw new Error('No URLs found in sitemap');

      setUrls((urls) => appendURLs(urls, sites));
      validate();
      onContinue();
    } catch (e: any) {
      setError(e?.message ?? 'Unable to fetch sitemap.');
    } finally {
      enableClose();
    }
  };

  return (
    <>
      <Modal.Header title="Import from sitemap" onClose={onClose} />
      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Box direction="column">
          <TextField
            autoFocus
            placeholder="Enter sitemap URL"
            label="Sitemap URL"
            error={error.length > 0}
            value={sitemapURL}
            onValueChange={setSitemapURL}
            caption={error.length > 0 ? '' : CAPTION}
            errorMessage={error}
            disabled={closePrevented}
          />
        </Box>
        {isRefreshEnabled && <RefreshRateSelect isDisabled={closePrevented} />}
      </Box>
      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={closePrevented} />
        <Modal.Footer.Button label="Continue" isLoading={closePrevented} disabled={closePrevented} className={submitButtonStyles} onClick={onNext} />
      </Modal.Footer>
    </>
  );
};
