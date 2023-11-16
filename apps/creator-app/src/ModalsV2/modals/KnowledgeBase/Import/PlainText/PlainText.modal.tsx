import { Box, Text, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useInput, useInputStateWithError } from '@/hooks/input.hook';
import { useValidator } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { labelStyles, submitButtonStyles, textareaStyles } from './PlainText.css';

interface IImportPlainText {
  onSave: (text: string) => Promise<void>;
}

export const ImportPlainText = manager.create<IImportPlainText>(
  'KBImportPlainText',
  () =>
    ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
      const [loading, setLoading] = React.useState(false);
      const [text, textError, setText, setTextError] = useInputStateWithError('');

      const validator = useValidator<{ text: string }>({
        setTextError,
        validateText: (value) => !value && 'Text is required.',
      });

      const validate = () => {
        if (!text.length) {
          setTextError('Text is required.');
          return false;
        }
        return true;
      };

      const onSubmit = validator.container(async () => {
        if (!validate()) return;
        setLoading(true);
        onSave(text);
        setLoading(false);
        api.close();
      });

      const input = useInput({
        error: textError,
        value: text,
        onSave: setText,
        autoFocus: true,
        allowEmpty: false,
      });

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header title="Import text" onClose={api.close} />
          <Box mt={20} mx={24} mb={24} direction="column">
            <Text variant="fieldLabel" className={labelStyles}>
              Content
            </Text>
            <TextArea.AutoSize
              {...input.attributes}
              placeholder="Enter or paste text here..."
              className={textareaStyles}
              caption={textError || undefined}
            />
          </Box>
          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={loading} />
            <Modal.Footer.Button
              label={closePrevented || loading ? '' : 'Import'}
              isLoading={closePrevented || loading}
              disabled={closePrevented || loading}
              className={submitButtonStyles}
              onClick={() => onSubmit({ text })}
            />
          </Modal.Footer>
        </Modal>
      );
    }
);
