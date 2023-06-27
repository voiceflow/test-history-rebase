import { Utils } from '@voiceflow/common';
import { Badge, Box, Button, Input, Modal, SvgIcon, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import TextArea from '@/components/TextArea';
import { HTTPS_URL_REGEX } from '@/constants';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import manager from '@/ModalsV2/manager';

const MAX_ROWS = 300;
const PLACEHOLDER = `https://example.com/about`;

interface WebManagerProps {
  save: (urls: string[]) => void;
}

const sanitizeURL = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }
  return url.trim();
};

// add https:// if not present
const sanitizeURLs = (urls: string): string[] => {
  return urls
    .split('\n')
    .filter((url) => !!url.trim())
    .map(sanitizeURL);
};

const WebManager = manager.create<WebManagerProps>('WebManager', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const [urls, setUrls] = React.useState<string>('');
  const [sitemap, setSitemap] = React.useState<string>('');
  const [loadingSitemap, setLoadingSitemap] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const validate = () => {
    // validate if urls are valid
    const urlList = sanitizeURLs(urls);
    const errors = urlList.filter((url) => !HTTPS_URL_REGEX.test(url)).map((url) => `${url} is not a valid URL`);
    if (urlList.length > MAX_ROWS) errors.push(`Only ${MAX_ROWS} URLs are allowed, currently ${urlList.length}`);

    setErrors(errors);
    return errors.length === 0;
  };

  const onSave = () => {
    if (!validate()) return;

    // only save MAX_ROWS
    save(Utils.array.unique(sanitizeURLs(urls)));
    api.close();
  };

  const addSiteMap = async () => {
    if (!sitemap) return;

    try {
      setLoadingSitemap(true);
      const sitemapURL = sanitizeURL(sitemap);
      if (!HTTPS_URL_REGEX.test(sitemapURL) || !sitemapURL.endsWith('/sitemap.xml')) {
        throw new Error('Invalid sitemap URL');
      }

      const { data: sites } = await client.apiV3.fetch.post<string[]>(`/projects/${projectID}/knowledge-base/sitemap`, { sitemapURL });

      setUrls((urls) =>
        Utils.array
          .unique([...urls.trim().split('\n'), ...sites])
          .filter(Boolean)
          .join('\n')
      );
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to fetch sitemap');
    } finally {
      setSitemap('');
      setLoadingSitemap(false);
    }
  };

  const hasError = !!errors.length;

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={700}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Add URLs
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
        <hr />
        <Box mb={11} fontWeight={600} color={ThemeColor.SECONDARY}>
          Add URLs (separate by line)
        </Box>
        <TextArea value={urls} onChangeText={setUrls} minRows={2} maxRows={25} placeholder={PLACEHOLDER} onBlur={validate} error={hasError} />
        {hasError && (
          <Box color={ThemeColor.ERROR} mt={8}>
            {errors.map((error, index) => (
              <Box key={index}>{error}</Box>
            ))}
          </Box>
        )}
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>
        <Button disabled={closePrevented || !urls || hasError} onClick={onSave}>
          Add URLs
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default WebManager;
