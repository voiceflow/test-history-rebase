import { tid } from '@voiceflow/style';
import { Box, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { DEFAULT_DOCUMENT_LIMIT } from '../../KnowledgeBaseImport.constant';
import {
  filterWhitespace,
  sanitizeURLsWithDataFormatting,
  urlsValidator,
  useDocumentLimitError,
} from '../../KnowledgeBaseImport.utils';
import { submitButtonStyles, textareaBoxStyles, textareaStyles } from '../KBImportSitemap.css';
import type { IKBImportSitemapPreview } from './KBImportSitemapPreview.interface';

export const KBImportSitemapPreview: React.FC<IKBImportSitemapPreview> = ({
  urls,
  refreshRate,
  onBack,
  setURLs,
  onClose,
  enableClose,
  disableClose,
  closePrevented,
  testID,
}) => {
  const [error, setError] = useState<string | null>(null);
  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS);

  const checkDocumentLimitError = useDocumentLimitError(enableClose);
  const createManyFromData = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromData);

  const validator = useValidators({
    urls: [urlsValidator, setError],
  });

  const onCreate = validator.container(
    async ({ urls }) => {
      disableClose();

      const data = sanitizeURLsWithDataFormatting(urls, refreshRate);
      try {
        await createManyFromData(data);
        enableClose();
        onClose();
      } catch (error) {
        checkDocumentLimitError(error);
      }
    },
    () => ({
      limit: planConfig?.limit || DEFAULT_DOCUMENT_LIMIT,
    })
  );

  const onSubmit = () => {
    onCreate({ urls: filterWhitespace(urls) });
  };

  const onSave = (value: string) => {
    setURLs(value);
    const validate = validator.container(
      () => {},
      () => ({
        limit: planConfig?.limit || DEFAULT_DOCUMENT_LIMIT,
      })
    );
    validate({ urls: value });
  };

  const input = useInput<string, HTMLTextAreaElement>({
    value: urls,
    error,
    onSave,
  });

  const count = React.useMemo(() => filterWhitespace(urls).split('\n').length, [urls]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <>
      <Modal.Header
        title="Review & confirm URLs"
        onClose={onClose}
        leftButton={<Modal.Header.LeftButton iconName="ArrowLeft" onClick={onBack} />}
        testID={tid(testID, 'header')}
      />

      <Box mt={20} direction="column" className={textareaBoxStyles}>
        <Box mx={24} direction="column" gap={6} grow={1}>
          <Box pb={24} direction="column" grow={1}>
            <TextArea.AutoSize
              {...input.attributes}
              label="URL(s)"
              caption={input.errored ? undefined : `${pluralize('URL', count, true)} added.`}
              errorMessage={input.errorMessage}
              disabled={closePrevented}
              className={textareaStyles}
              placeholder="Enter URL(s)"
              horizontalScroll
              onKeyDown={onKeyDown}
              testID={tid(testID, 'urls')}
            />
          </Box>
        </Box>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button
          label="Cancel"
          variant="secondary"
          onClick={onClose}
          disabled={closePrevented}
          testID={tid(testID, 'cancel')}
        />

        <Modal.Footer.Button
          label={`Import ${count} URLs`}
          onClick={onSubmit}
          disabled={closePrevented}
          isLoading={closePrevented}
          className={submitButtonStyles}
          testID={tid(testID, 'import')}
        />
      </Modal.Footer>
    </>
  );
};
