import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useFeature } from '@/hooks';
import manager from '@/ModalsV2/manager';

import { FieldLabel } from '../components/FieldLabel/FieldLabel.component';
import { RefreshRateSelect } from '../components/RefreshRateSelect/RefreshRateSelect.component';
import { useURLs } from '../Import.hook';
import { sanitizeURLs } from '../Import.utils';
import { submitButtonStyles, textareaStyles } from './ImportUrl.css';

interface ImportUrlProps {
  onSave: (urls: string[]) => Promise<void> | void;
}

export const ImportUrl = manager.create<ImportUrlProps>('KBImportURL', () => ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
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
      await onSave(Utils.array.unique(sanitizeURLs(urls)));

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
    }
  };

  return (
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
      <Modal.Header title="Import from URL(s)" onClose={api.close} />

      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Box direction="column">
          <FieldLabel>Add URLs (separate by line)</FieldLabel>

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

        {isRefreshEnabled && <RefreshRateSelect isDisabled={closePrevented} />}
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={closePrevented} />

        <Modal.Footer.Button
          label={closePrevented ? '' : 'Import'}
          onClick={onSubmit}
          disabled={closePrevented || disabled}
          isLoading={closePrevented}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </Modal.Container>
  );
});
