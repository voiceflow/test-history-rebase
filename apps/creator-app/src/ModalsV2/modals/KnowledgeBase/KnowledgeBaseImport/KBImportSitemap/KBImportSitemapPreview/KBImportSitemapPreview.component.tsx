import { BaseModels } from '@voiceflow/base-types';
import { Box, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { KBFieldLabel } from '../../components/KBFieldLabel/KBFieldLabel.component';
import { filterWhitespace, sanitizeURLs, urlsValidator } from '../../KnowledgeBaseImport.utils';
import { errorTextStyles, submitButtonStyles, textareaBoxStyles, textareaStyles } from '../KBImportSitemap.css';
import { IKBImportSitemapPreview } from './KBImportSitemapPreview.interface';

export const KBImportSitemapPreview: React.FC<IKBImportSitemapPreview> = ({
  urls,
  refreshRate,
  onBack,
  setURLs,
  onClose,
  enableClose,
  disableClose,
  closePrevented,
}) => {
  const [error, setError] = useState<string | null>(null);

  const createManyFromData = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromData);

  const validator = useValidators({
    urls: [urlsValidator, setError],
  });

  const onCreate = validator.container(async ({ urls }) => {
    disableClose();

    await createManyFromData(
      sanitizeURLs(urls.split('\n')).map((url) => ({ url, name: url, type: BaseModels.Project.KnowledgeBaseDocumentType.URL, refreshRate }))
    );

    enableClose();
    onClose();
  });

  const onSubmit = () => {
    onCreate({ urls: filterWhitespace(urls) });
  };

  const onSave = (value: string) => {
    setURLs(value);
    const validate = validator.container(() => {});
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
      <Modal.Header title="Review & confirm URLs" onClose={onClose} leftButton={<Modal.Header.LeftButton iconName="ArrowLeft" onClick={onBack} />} />

      <Box mt={20} direction="column" className={textareaBoxStyles}>
        <Box mx={24} direction="column" gap={6} grow={1}>
          <KBFieldLabel>URL(s)</KBFieldLabel>

          <Box pb={24} grow={1}>
            <TextArea.AutoSize
              {...input.attributes}
              caption={input.errorMessage || `${pluralize('URL', count, true)} added.`}
              disabled={closePrevented}
              className={textareaStyles}
              placeholder="Enter URL(s)"
              captionClassName={errorTextStyles}
              horizontalScroll
              onKeyDown={onKeyDown}
            />
          </Box>
        </Box>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={closePrevented} />

        <Modal.Footer.Button
          label={`Import ${count} URLs`}
          onClick={onSubmit}
          disabled={closePrevented}
          isLoading={closePrevented}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </>
  );
};
