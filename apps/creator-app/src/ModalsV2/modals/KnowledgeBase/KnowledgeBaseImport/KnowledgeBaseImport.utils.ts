import { Utils } from '@voiceflow/common';
import { notify } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import { composeValidators, validatorFactory } from '@voiceflow/utils-designer';

import { LimitType } from '@/constants/limits';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { URL_ONLY_REGEX } from '@/utils/string.util';

import { URLS_LIMIT } from './KnowledgeBaseImport.constant';
// add https:// if not present
export const sanitizeURL = (url: string): string => {
  const trimmedURL = url.trim();

  if (!trimmedURL) return '';

  return trimmedURL.match(/^https?:\/\//) ? trimmedURL : `https://${trimmedURL}`;
};

export const sanitizeURLs = (urls: string[]): string[] => Utils.array.unique(urls.map(sanitizeURL).filter(Boolean));

export const filterWhitespace = (urls: string): string =>
  urls
    .trim()
    .split('\n')
    .filter((url) => url.trim())
    .join('\n');

export const hasUrlValidator = validatorFactory((urls: string) => {
  return urls.trim();
}, 'At least one URL is required.');

export const urlMaxNumberValidator = validatorFactory(
  (urls: string) => urls.split('\n').length <= URLS_LIMIT,
  `URLs must be less than ${URLS_LIMIT}`
);

export const urlRegexValidator = validatorFactory(
  (urls: string) => urls.split('\n').every((url) => url.trim().match(URL_ONLY_REGEX)),
  (urls) => {
    const filteredUrls = urls.split('\n').filter((url) => {
      if (!url.trim()) return false;
      return !url.trim().match(URL_ONLY_REGEX);
    });

    return filteredUrls
      .map((url, index) =>
        filteredUrls.length === 0 || index === filteredUrls.length - 1 ? `"${url}" is not a valid URL.` : `"${url}" is not a valid URL,`
      )
      .slice(0, 5)
      .join('\n');
  }
);

export const urlsValidator = composeValidators(hasUrlValidator, urlMaxNumberValidator, urlRegexValidator);

export const useDocumentLimitError = (enableClose: VoidFunction) => {
  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS, { limit: 5000 });
  const upgradeModal = useUpgradeModal();

  return (error: any) => {
    if (error.response.status === 406 && planConfig) {
      const limit = error.response.data.kbDocsLimit;
      notify.long.warning(`Document limit (${limit}) reached for your current subscription. Please upgrade to continue.`, {
        actionButtonProps: { label: 'Upgrade', onClick: () => upgradeModal.openVoid(planConfig.upgradeModal({ limit })) },
        bodyStyle: {
          color: Tokens.colors.neutralDark.neutralsDark900,
          fontSize: Tokens.typography.size[14],
          lineHeight: Tokens.typography.lineHeight[20],
          fontFamily: Tokens.typography.family.regular,
        },
      });
    } else {
      notify.short.error('Failed to import data sources');
    }
    enableClose();
  };
};
