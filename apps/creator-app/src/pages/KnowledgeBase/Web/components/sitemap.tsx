/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Badge, Box, Button, Input, Modal, SvgIcon, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { HTTPS_URL_REGEX } from '@/constants';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import manager from '@/ModalsV2/manager';

import { appendURLs, formatURLs, sanitizeURL, useURLs } from '../hooks';
import URLTextArea from './URLTextArea';

interface WebManagerProps {
  save: (urls: string[]) => void;
}

const fetchSitemap = async (url: string, projectID: string): Promise<string[]> => {
  const urlsToTry: string[] = [];

  if (!url.endsWith('.xml')) {
    url += url.endsWith('/') ? '' : '/';
    urlsToTry.push(`${url}sitemap.xml`);
    urlsToTry.push(`${url}sitemap_index.xml`);
    urlsToTry.push(`${url}sitemap/sitemap.xml`);
  } else {
    urlsToTry.push(url);
  }

  for (const sitemapURL of urlsToTry) {
    const { data: sites } = await client.apiV3.fetch
      .post<string[]>(`/projects/${projectID}/knowledge-base/sitemap`, { sitemapURL })
      .catch(() => ({ data: [] }));
    if (sites?.length) return sites;
  }
  return [];
};

const WebManager = manager.create<WebManagerProps>('KnowledgeBaseSitemap', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const [sitemap, setSitemap] = React.useState<string>('');
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false);
  const [loadingSitemap, setLoadingSitemap] = React.useState<boolean>(false);

  const urlAPI = useURLs();
  const { urls, setUrls, validate, disabled } = urlAPI;

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const onSave = () => {
    if (!validate()) return;

    // only save MAX_ROWS
    save(formatURLs(urls));
    api.close();
  };

  const addSiteMap = async () => {
    if (!sitemap) return;

    try {
      setLoadingSitemap(true);

      const sitemapURL = sanitizeURL(sitemap);
      if (!HTTPS_URL_REGEX.test(sitemapURL)) throw new Error('Invalid sitemap URL');
      const sites = await fetchSitemap(sitemapURL, projectID);
      if (!sites?.length) throw new Error('No URLs found in sitemap');

      setUrls((urls) => appendURLs(urls, sites));
      setHasLoaded(true);
      setSitemap('');
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to fetch sitemap');
    } finally {
      setLoadingSitemap(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={700}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Add URLs from Sitemap
      </Modal.Header>
      <Modal.Body mt={16}>
        <Box mb={11} fontWeight={600} color={ThemeColor.SECONDARY}>
          Add Sitemap (optional)
        </Box>
        <Input
          nested
          disabled={loadingSitemap}
          readOnly={loadingSitemap}
          placeholder="https://example.com/sitemap.xml"
          value={sitemap}
          onChangeText={setSitemap}
          onEnterPress={addSiteMap}
          rightAction={
            loadingSitemap ? (
              <SvgIcon icon="arrowSpin" spin variant={SvgIcon.Variant.TERTIARY} />
            ) : (
              !!sitemap && (
                <Badge slide onClick={addSiteMap}>
                  Enter
                </Badge>
              )
            )
          }
        />
        {hasLoaded && (
          <>
            <hr />
            <URLTextArea {...urlAPI} />
          </>
        )}
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>
        <Button disabled={closePrevented || disabled} onClick={onSave}>
          Add URLs
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default WebManager;
