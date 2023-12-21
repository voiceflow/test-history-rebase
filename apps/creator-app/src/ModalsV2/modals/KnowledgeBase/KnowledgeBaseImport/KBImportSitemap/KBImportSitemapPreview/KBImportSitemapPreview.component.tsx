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
import { sanitizeURLs, urlsValidator } from '../../KnowledgeBaseImport.utils';
import { errorTextStyles, submitButtonStyles, textareaStyles } from '../KBImportSitemap.css';
import { IKBImportSitemapPreview } from './KBImportSitemapPreview.interface';

export const KBImportSitemapPreview: React.FC<IKBImportSitemapPreview> = ({
  urls,
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
      sanitizeURLs(urls.split('\n')).map((url) => ({ url, name: url, type: BaseModels.Project.KnowledgeBaseDocumentType.URL }))
    );

    enableClose();
    onClose();
  });

  const onSubmit = () => {
    onCreate({ urls });
  };

  const input = useInput<string, HTMLTextAreaElement>({
    value: urls,
    error,
    onSave: (value) => {
      setURLs(value);
      setError(null);
    },
  });

  const count = urls.split('\n').length;

  return (
    <>
      <Modal.Header title="Review & confirm URLs" onClose={onClose} leftButton={<Modal.Header.LeftButton iconName="ArrowLeft" onClick={onBack} />} />

      <Box mt={20} mx={24} mb={24} direction="column" gap={6}>
        <KBFieldLabel>URL(s)</KBFieldLabel>

        <TextArea.AutoSize
          {...input.attributes}
          caption={input.errorMessage || `${pluralize('URL', count, true)} added.`}
          disabled={closePrevented}
          className={textareaStyles}
          placeholder="Enter URL(s)"
          captionClassName={errorTextStyles}
        />
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
