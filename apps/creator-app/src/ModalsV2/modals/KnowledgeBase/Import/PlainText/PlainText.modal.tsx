import { Box, TextArea } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { FieldLabel } from '../components/FieldLabel/FieldLabel.component';
import { submitButtonStyles, textareaStyles } from './PlainText.css';

interface IImportPlainText {
  onSave: (text: string) => Promise<void>;
}

export const ImportPlainText = manager.create<IImportPlainText>(
  'KBImportPlainText',
  () =>
    ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
      const textState = useInputState();

      const validator = useValidators({
        text: [validatorFactory((text: string) => text.trim(), 'Text is required.'), textState.setError],
      });

      const onCreate = validator.container(async ({ text }) => {
        try {
          api.preventClose();

          await onSave(text);

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      });

      const input = useInput<string, HTMLTextAreaElement>({
        error: textState.error,
        value: textState.value,
        onSave: textState.setValue,
        autoFocus: true,
        allowEmpty: false,
      });

      const onSubmit = () => onCreate({ text: textState.value });

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Import text" onClose={api.onClose} />

          <Box mt={20} mx={24} mb={24} direction="column">
            <FieldLabel>Content</FieldLabel>

            <TextArea.AutoSize
              {...input.attributes}
              disabled={closePrevented}
              caption={input.errorMessage ?? undefined}
              className={textareaStyles}
              placeholder="Enter or paste text here..."
            />
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} />

            <Modal.Footer.Button
              label={closePrevented ? '' : 'Import'}
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
              className={submitButtonStyles}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
