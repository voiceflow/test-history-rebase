import { Box, Text, TextArea } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { labelStyles, submitButtonStyles, textareaStyles } from './PlainText.css';

interface IImportPlainText {
  onSave: (text: string) => Promise<void>;
}

export const ImportPlainText = manager.create<IImportPlainText>(
  'KBImportPlainText',
  () =>
    ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
      const textState = useInputState();

      const validator = useValidators({
        text: [validatorFactory((text: string) => text.trim(), 'Text is required'), textState.setError],
      });

      const onSubmit = validator.container(async ({ text }) => {
        try {
          api.preventClose();

          await onSave(text);

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      });

      const input = useInput({
        error: textState.error,
        value: textState.value,
        onSave: textState.setValue,
        autoFocus: true,
        allowEmpty: false,
      });

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header title="Import text" onClose={api.close} />

          <Box mt={20} mx={24} mb={24} direction="column">
            <Text variant="fieldLabel" className={labelStyles}>
              Content
            </Text>

            <TextArea.AutoSize
              {...input.attributes}
              caption={textState.error ?? undefined}
              className={textareaStyles}
              placeholder="Enter or paste text here..."
            />
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} disabled={closePrevented} />

            <Modal.Footer.Button
              label={closePrevented ? '' : 'Import'}
              onClick={() => onSubmit({ text: textState.value })}
              disabled={closePrevented}
              isLoading={closePrevented}
              className={submitButtonStyles}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
