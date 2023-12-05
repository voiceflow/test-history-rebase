import { Utils } from '@voiceflow/common';
import { Box, Text, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { sanitizeURLs } from '../../Import.utils';
import { labelStyles, submitButtonStyles, textareaStyles } from '../ImportSitemap.css';

interface URLReviewProps {
  urls: string;
  errors: string[];
  disabled: boolean;
  validate: () => boolean;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
  onClose: VoidFunction;
  onSave: (urls: string[]) => void;
}

export const URLReview: React.FC<URLReviewProps> = ({ urls, errors, disabled, validate, setUrls, onClose, onSave }) => {
  const [loading, setLoading] = React.useState(false);

  const count = React.useMemo(() => urls.split('\n').filter((line) => line.trim().length !== 0).length, [urls]);

  const caption = React.useMemo(() => {
    if (errors.length) return errors.join('\n');
    if (!count) return 'One url per line.';
    const urlSuffix = count > 1 ? 'URLs' : 'URL';
    return `${count} ${urlSuffix} added.`;
  }, [errors, urls]);

  const onSubmit = async () => {
    if (!urls.length || !validate()) return;
    setLoading(true);
    await Promise.resolve(onSave(Utils.array.unique(sanitizeURLs(urls))));
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Modal.Header title="Review & confirm URLs" onClose={onClose} />
      <Box mt={20} mx={24} mb={24} direction="column">
        <Text variant="fieldLabel" className={labelStyles}>
          URL(s)
        </Text>
        <TextArea.AutoSize
          error={errors.length > 0}
          value={urls}
          onValueChange={(value) => setUrls(value)}
          caption={caption}
          onBlur={validate}
          disabled={loading}
          className={textareaStyles}
        />
      </Box>
      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={loading} />
        <Modal.Footer.Button
          label={loading ? '' : `Import ${count} URLs`}
          isLoading={loading}
          disabled={loading || disabled}
          onClick={onSubmit}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </>
  );
};
