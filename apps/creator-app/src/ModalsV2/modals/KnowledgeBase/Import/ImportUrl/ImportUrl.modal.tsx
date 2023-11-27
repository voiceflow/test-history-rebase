import { Utils } from '@voiceflow/common';
import { Box, LoadingSpinner, Text, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { labelStyles, submitButtonStyles, textareaStyles } from './ImportUrl.css';
import { useURLs } from './ImportUrl.hook';
import { sanitizeURLs } from './ImportUrl.util';

interface ImportUrlProps {
  save: (urls: string[]) => Promise<void>;
}

export const ImportUrl = manager.create<ImportUrlProps>('KBImportURL', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const urlAPI = useURLs();
  const { urls, errors, validate, setUrls, disabled } = urlAPI;

  const caption = React.useMemo(() => {
    if (errors.length) return errors.join('\n');

    const count = urls.split('\n').filter((line) => line.trim().length !== 0).length;

    if (!count) return 'One url per line.';

    const urlSuffix = count > 1 ? 'URLs' : 'URL';

    return `${count} ${urlSuffix} added.`;
  }, [errors, urls]);

  const onSubmit = async () => {
    if (!validate()) return;

    api.preventClose();

    try {
      await save(Utils.array.unique(sanitizeURLs(urls)));

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
    }
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header title="Import from URL(s)" onClose={api.close} />

      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Text variant="fieldLabel" className={labelStyles}>
          Add URLs (separate by line)
        </Text>

        <TextArea.AutoSize
          error={errors.length > 0}
          value={urls}
          onBlur={validate}
          caption={caption}
          disabled={closePrevented}
          className={textareaStyles}
          placeholder="Enter URL(s)"
          onValueChange={(value) => setUrls(value)}
        />
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={closePrevented} />

        <Modal.Footer.Button
          label={closePrevented ? '' : 'Import'}
          onClick={onSubmit}
          disabled={closePrevented || disabled}
          isLoading={closePrevented}
          className={submitButtonStyles}
        >
          {closePrevented && <LoadingSpinner size="medium" variant="light" />}
        </Modal.Footer.Button>
      </Modal.Footer>
    </Modal.Container>
  );
});
