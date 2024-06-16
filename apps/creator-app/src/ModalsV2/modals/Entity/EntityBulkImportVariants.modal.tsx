import composeRefs from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import { EntityVariant } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { InputFormControl, notify, Scroll, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { useDropCSVFile } from '@/hooks/file.hook';
import { useInput, useInputState } from '@/hooks/input.hook';

import { modalsManager } from '../../manager';

export interface IEntityBulkImportVariantsModal {
  onImport: (variants: Pick<EntityVariant, 'value' | 'synonyms'>[]) => Promise<EntityVariant[]> | void;
}

export const EntityBulkImportVariantsModal = modalsManager.create<IEntityBulkImportVariantsModal>(
  'EntityBulkImportVariantsModal',
  () =>
    ({ api, type, opened, hidden, animated, onImport, closePrevented }) => {
      const TEST_ID = 'bulk-import-entity-variants-modal';

      const state = useInputState();
      const [dropProps, connectDrop] = useDropCSVFile({ onDrop: state.setValue, onError: state.setError });

      const input = useInput<string, HTMLTextAreaElement>({
        value: state.value,
        error: state.error,
        onSave: state.setValue,
        autoFocus: true,
      });

      const lines = useMemo(
        () => Utils.array.unique(state.value.split('\n').map((line) => line.trim())).filter(Boolean),
        [state.value]
      );

      const onImportClick = async () => {
        if (!lines.length) {
          state.setError('Entity value(s) required.');
          return;
        }

        if (lines.length > 1000) {
          state.setError('Maximum 1000 entity values allowed.');
          return;
        }

        try {
          api.preventClose();

          await onImport(
            lines.map((text) => {
              const [value, ...synonyms] = text.split(',');

              return {
                value: value.trim(),
                synonyms: synonyms.map((synonym) => synonym.trim()),
              };
            })
          );

          api.enableClose();
          api.close();

          notify.short.success(`${pluralize('entity value', lines.length, true)} imported`);
        } catch (err) {
          api.enableClose();

          notify.short.error(`Failed to import ${pluralize('entity value', lines.length)}`);
        }
      };

      const getCaption = () => {
        if (input.errorMessage) return undefined;

        if (!lines.length) return 'Format: value 1: synonym 1, 2, 3... One entity value per line.';

        return `${pluralize('entity value', lines.length, true)} added.`;
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
          <Modal.Header title="Bulk import entity values" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body>
              <InputFormControl label="Entity values" controlTestID={tid(TEST_ID, 'values')}>
                <TextArea
                  caption={getCaption()}
                  minHeight={36}
                  disabled={closePrevented}
                  placeholder={`${dropProps.isOver ? 'Drop a .csv file here' : 'Enter values, or drop CSV here'}`}
                  errorMessage={input.errorMessage}
                  {...input.attributes}
                  ref={composeRefs<HTMLTextAreaElement>(input.attributes.ref, connectDrop)}
                  testID={tid(TEST_ID, 'values')}
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
