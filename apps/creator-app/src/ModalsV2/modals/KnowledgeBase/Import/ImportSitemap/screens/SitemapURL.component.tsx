/* eslint-disable no-await-in-loop */
import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import { HTTPS_URL_REGEX } from '@/constants';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import { appendURLs, sanitizeURL } from '../../Import.utils';
import { submitButtonStyles } from '../ImportSitemap.css';

interface SitemapURLProps {
  validate: () => boolean;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
  onClose: VoidFunction;
  onContinue: VoidFunction;
}

export const SitemapURL: React.FC<SitemapURLProps> = ({ validate, setUrls, onClose, onContinue }) => {
  const [sitemapURL, setSitemapURL] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const caption = React.useMemo(() => {
    if (error) return error;
    return `e.g. https://www.domain.com/sitemap.xml`;
  }, [error]);

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
      setLoading(true);
      if (!sitemapURL) throw new Error('Must provide sitemap.');

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
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Header title="Import from sitemap" onClose={onClose} />
      <Box mt={20} mx={24} mb={24} direction="column">
        <TextField
          placeholder="Enter sitemap URL"
          label="Sitemap URL"
          error={error.length > 0}
          value={sitemapURL}
          onValueChange={setSitemapURL}
          caption={caption}
          disabled={loading}
        />
      </Box>
      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={loading} />
        <Modal.Footer.Button
          label={loading ? '' : 'Continue'}
          isLoading={loading}
          disabled={loading}
          className={submitButtonStyles}
          onClick={onNext}
        />
      </Modal.Footer>
    </>
  );
};
