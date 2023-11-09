import { Utils } from '@voiceflow/common';
import { Box, LoadingSpinner, Text, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import manager from '@/ModalsV2/manager';

import { sanitizeURLs, useURLs } from '../utils';
import { labelStyles, submitButtonStyles, textareaStyles } from './ImportUrl.css';

interface ImportUrlProps {
  save: (urls: string[]) => void;
}

export const ImportUrl = manager.create<ImportUrlProps>('KBImportURL', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const urlAPI = useURLs();
  const [loading, setLoading] = React.useState(false);
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
    setLoading(true);
    await Promise.resolve(save(Utils.array.unique(sanitizeURLs(urls))));
    setLoading(false);
    api.close();
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header title="Import from URL(s)" onClose={api.close} />
      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Text variant="fieldLabel" className={labelStyles}>
          Add URLs (separate by line)
        </Text>
        <TextArea.AutoSize
          placeholder="Enter URL(s)"
          error={errors.length > 0}
          value={urls}
          onValueChange={(value) => {
            setUrls(value);
          }}
          className={textareaStyles}
          caption={caption}
          onBlur={validate}
          disabled={loading}
        />
      </Box>
      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={loading} />
        <Modal.Footer.Button
          label={closePrevented || loading ? '' : 'Import'}
          isLoading={closePrevented}
          disabled={closePrevented || disabled || loading}
          className={submitButtonStyles}
          onClick={onSubmit}
        >
          {loading && <LoadingSpinner size="medium" variant="light" />}
        </Modal.Footer.Button>
      </Modal.Footer>
    </Modal>
  );
});
