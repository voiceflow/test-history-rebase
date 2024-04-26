import type { Utterance } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { InputFormControl, notify, Scroll, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { useInput, useInputState } from '@/hooks/input.hook';
import { utteranceTextFactory } from '@/utils/utterance.util';

import { modalsManager } from '../../manager';

export interface IntentBulkImportUtterancesModalProps {
  onImport: (utterances: Pick<Utterance, 'text'>[]) => Promise<Utterance[]> | void;
}

export const IntentBulkImportUtterancesModal = modalsManager.create<IntentBulkImportUtterancesModalProps>(
  'IntentBulkImportUtterancesModal',
  () =>
    ({ api, type, opened, hidden, animated, onImport, closePrevented }) => {
      const TEST_ID = 'bulk-import-utterances-modal';

      const state = useInputState();

      const input = useInput<string, HTMLTextAreaElement>({
        value: state.value,
        error: state.error,
        onSave: state.setValue,
        autoFocus: true,
      });

      const lines = useMemo(
        () =>
          state.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        [state.value]
      );

      const onImportClick = async () => {
        if (!lines.length) {
          state.setError('Utterance(s) required.');
          return;
        }

        try {
          api.preventClose();

          await onImport(lines.map((text) => ({ text: utteranceTextFactory(text) })));

          api.enableClose();
          api.close();

          notify.short.success(`${pluralize('utterance', lines.length, true)} imported`);
        } catch (err) {
          api.enableClose();

          notify.short.error(`Failed to import ${pluralize('utterance', lines.length)}`);
        }
      };

      const getCaption = () => {
        if (input.errorMessage) return input.errorMessage;

        if (!lines.length) return 'One utterance per line.';

        return `${pluralize('utterance', lines.length, true)} added.`;
      };

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onImportClick}
          testID={TEST_ID}
        >
          <Modal.Header title="Bulk import utterances" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body>
              <InputFormControl label="Utterances" controlTestID={tid(TEST_ID, 'utterances')}>
                <TextArea
                  caption={getCaption()}
                  minHeight={36}
                  disabled={closePrevented}
                  placeholder="Enter utterances"
                  {...input.attributes}
                  testID={tid(TEST_ID, 'utterances')}
                />
              </InputFormControl>
            </Modal.Body>
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button
              label="Close"
              variant="secondary"
              onClick={api.onClose}
              disabled={closePrevented}
              testID={tid(TEST_ID, 'close')}
            />

            <Modal.Footer.Button
              label="Import"
              variant="primary"
              onClick={onImportClick}
              disabled={closePrevented}
              isLoading={closePrevented}
              testID={tid(TEST_ID, 'import')}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
