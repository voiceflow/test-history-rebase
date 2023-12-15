import { Utils } from '@voiceflow/common';
import { Box, Text, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { sanitizeURLs } from '../../Import.utils';
import { errorTextStyles, labelStyles, submitButtonStyles, textareaStyles } from '../ImportSitemap.css';

interface URLReviewProps {
  urls: string;
  errors: string[];
  disabled: boolean;
  validate: () => boolean;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
  onClose: VoidFunction;
  onSave: (urls: string[]) => void;
  onBack: () => void;
  closePrevented: boolean;
  enableClose: () => void;
  disableClose: () => void;
}

export const URLReview: React.FC<URLReviewProps> = ({
  urls,
  errors,
  disabled,
  validate,
  setUrls,
  onClose,
  onSave,
  onBack,
  closePrevented,
  enableClose,
  disableClose,
}) => {
  const count = React.useMemo(() => urls.split('\n').filter((line) => line.trim().length !== 0).length, [urls]);

  const caption = React.useMemo(() => {
    if (errors.length > 1) return errors.join(', ');
    if (errors.length === 1) return `${errors[0]}.`;
    if (!count) return 'One url per line.';
    const urlSuffix = count > 1 ? 'URLs' : 'URL';
    return `${count} ${urlSuffix} added.`;
  }, [errors, urls]);

  const onSubmit = async () => {
    if (!urls.length || !validate()) return;
    disableClose();
    await Promise.resolve(onSave(Utils.array.unique(sanitizeURLs(urls))));
    enableClose();
    onClose();
  };

  return (
    <>
      <Modal.Header title="Review & confirm URLs" onClose={onClose} leftButton={<Modal.Header.LeftButton iconName="ArrowLeft" onClick={onBack} />} />
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
          disabled={closePrevented}
          className={textareaStyles}
          captionClassName={errorTextStyles}
        />
      </Box>
      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={closePrevented} />
        <Modal.Footer.Button
          label={`Import ${count} URLs`}
          isLoading={closePrevented}
          disabled={closePrevented || disabled}
          onClick={onSubmit}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </>
  );
};
