import { Utils } from '@voiceflow/common';
import { Box, Button, Checkbox, Modal, System, Text, toast, Upload, useSmartReducerV2 } from '@voiceflow/ui';
import Papa from 'papaparse';
import pluralize from 'pluralize';
import React from 'react';

import { slotUploadExampleCSV } from '@/assets';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import { useDebouncedCallback } from '@/hooks';
import { readFileAsText } from '@/utils/file';

import manager from '../../../manager';
import { Errors } from './components';
import { ACCEPTED_FILE_TYPES, DEBOUNCE_TIMEOUT, FILE_SIZE_LIMIT_BYTES, FILE_SIZE_LIMIT_KB, UPLOAD_VARIANTS, UploadType } from './constants';
import * as S from './styles';
import { getSlotsWithSynonyms, validateSlots } from './utils';

export interface Result {
  slots: string[][];
}

const Slots = manager.create<void, Result>('BulkImportSlots', () => ({ api, type, opened, hidden, animated }) => {
  const [state, stateApi] = useSmartReducerV2({
    errors: null as null | Map<number, string>,
    validSlots: [] as string[][],
    slotsCount: 0,
    readingFile: false,
    editorValue: '',
    inlineValue: '',
    ignoreErrors: false,
    uploadVariant: UploadType.INLINE,
    synonymsCount: 0,
    uploadDisabled: false,
  });
  const isInline = state.uploadVariant === UploadType.INLINE;

  const findSlotsAndSynonyms = useDebouncedCallback(
    DEBOUNCE_TIMEOUT,
    (value: string) => {
      const slotsWithSynonyms = getSlotsWithSynonyms(value);

      stateApi.update({
        slotsCount: slotsWithSynonyms.length,
        synonymsCount: slotsWithSynonyms.flatMap(Utils.array.tail).length,
      });
    },
    []
  );

  const onChangeUploadVariant = (variant: UploadType) => {
    stateApi.update({
      errors: null,
      validSlots: [],
      slotsCount: 0,
      editorValue: '',
      uploadVariant: variant,
      synonymsCount: 0,
      ignoreErrors: false,
      uploadDisabled: false,
    });
  };

  const onChange = (value: string) => {
    stateApi.update({
      editorValue: value,
      uploadDisabled: false,
      ...(isInline ? { inlineValue: value } : {}),
    });

    findSlotsAndSynonyms(value);
  };

  const onDropRejected = () => {
    toast.error('This file type is not supported, please upload a .CSV.');
  };

  const onDropAccepted = async (files: File[]) => {
    stateApi.readingFile.set(true);

    try {
      if (files[0].size > FILE_SIZE_LIMIT_BYTES) {
        toast.error(`.CSV file is too large, please upload a file up to ${FILE_SIZE_LIMIT_KB}KB.`);
        stateApi.readingFile.set(false);
        return;
      }

      const value = await readFileAsText(files[0]);

      const slotsWithSynonyms = getSlotsWithSynonyms(value);

      const editorValue = Papa.unparse(slotsWithSynonyms);

      findSlotsAndSynonyms(editorValue);
      findSlotsAndSynonyms.flush();

      stateApi.update({ editorValue, readingFile: false });
    } catch {
      toast.error('Unable to read this document, please contact support.');
      stateApi.readingFile.set(false);
    }
  };

  const onUpload = () => {
    const slotsWithSynonyms = getSlotsWithSynonyms(state.editorValue);

    const [errors, validSlots] = validateSlots(slotsWithSynonyms);

    if (errors.size && !state.ignoreErrors) {
      stateApi.update({ errors, validSlots, uploadDisabled: true });
    } else if (errors.size && state.ignoreErrors && !validSlots.length) {
      toast.error("There's nothing to upload, please fix the errors.");
    } else {
      api.resolve({ slots: validSlots });
      api.close();

      toast.success(
        `${pluralize('slot', validSlots.length, true)} and ${pluralize(
          'synonym',
          validSlots.flatMap(Utils.array.tail).length,
          true
        )} successfully imported!`
      );
    }
  };

  const onChangeIgnoreErrors = () => {
    stateApi.update({
      ignoreErrors: !state.ignoreErrors,
      ...(!state.ignoreErrors ? { uploadDisabled: false } : {}),
    });
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header>Bulk import Entities</Modal.Header>

      <Modal.Body>
        <Box mb={15}>
          <RadioGroup isFlat options={UPLOAD_VARIANTS} checked={state.uploadVariant} onChange={onChangeUploadVariant} />
        </Box>

        <Box mb={16}>
          {isInline || state.editorValue ? (
            <S.AceEditor
              key={String(isInline)}
              mode="slot"
              value={state.editorValue}
              focus
              onLoad={(editor) => editor.renderer.setPadding(12)}
              onChange={onChange}
              placeholder="One entity per line (value,synonym 1,…)"
            />
          ) : (
            <Upload.DropUpload
              label="CSV"
              isLoading={state.readingFile}
              canUseLink={false}
              onDropRejected={onDropRejected}
              onDropAccepted={onDropAccepted}
              acceptedFileTypes={ACCEPTED_FILE_TYPES}
            />
          )}
        </Box>

        {isInline || state.editorValue ? (
          <Text>
            {state.slotsCount} <Text color="#62778c">{pluralize('value', state.slotsCount)} with</Text> {state.synonymsCount}{' '}
            <Text color="#62778c">{pluralize('synonym', state.slotsCount)} included.</Text>
          </Text>
        ) : (
          <Text color="#62778c" fontSize={13}>
            One entity per row (value,synonym 1,synonym 2,...).{' '}
            <System.Link.Anchor download target="" href={slotUploadExampleCSV}>
              Download template
            </System.Link.Anchor>
          </Text>
        )}

        {!!state.errors?.size && (
          <>
            <S.Separator />

            <Errors name="entity" errors={state.errors} />

            <S.Separator />

            <Checkbox isFlat checked={state.ignoreErrors} onChange={onChangeIgnoreErrors}>
              Ignore failed {pluralize('entity', state.errors.size)}
            </Checkbox>

            <S.Separator isLast />
          </>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Box flex={1}>
          <System.Link.Anchor href={Documentation.BULK_IMPORT_SLOTS}>See tutorial</System.Link.Anchor>
        </Box>

        <Button onClick={api.close} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button disabled={!state.editorValue.trim() || state.uploadDisabled} onClick={onUpload} squareRadius>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Slots;
