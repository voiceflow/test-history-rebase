import { Box, Button, ButtonVariant, Checkbox, Link, Text, toast, Upload, useDidUpdateEffect, useSmartReducerV2 } from '@voiceflow/ui';
import _tail from 'lodash/tail';
import Papa from 'papaparse';
import pluralize from 'pluralize';
import React from 'react';

import { slotUploadExampleCSV } from '@/assets';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { useDebouncedCallback, useModals } from '@/hooks';
import { readFileAsText } from '@/utils/file';

import { AceEditor, Errors, Separator } from './components';
import { ACCEPTED_FILE_TYPES, DEBOUNCE_TIMEOUT, FILE_SIZE_LIMIT_BYTES, FILE_SIZE_LIMIT_KB, UPLOAD_VARIANTS, UploadType } from './constants';
import { getSlotsWithSynonyms, validateSlots } from './utils';

const ImportSlots: React.FC = () => {
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

  const { close, data, isOpened } = useModals<{ onUpload: (lines: string[][]) => void }>(ModalType.IMPORT_SLOTS);

  const findSlotsAndSynonyms = useDebouncedCallback(
    DEBOUNCE_TIMEOUT,
    (value: string) => {
      const slotsWithSynonyms = getSlotsWithSynonyms(value);

      stateApi.update({
        slotsCount: slotsWithSynonyms.length,
        synonymsCount: slotsWithSynonyms.flatMap(_tail).length,
      });
    },
    []
  );

  const onLoad = React.useCallback((editor?: any) => {
    editor?.renderer?.setPadding(12);
  }, []);

  const onChangeUploadVariant = React.useCallback((variant: UploadType) => {
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
  }, []);

  const onChange = React.useCallback(
    (value: string) => {
      stateApi.update({
        editorValue: value,
        uploadDisabled: false,
        ...(isInline ? { inlineValue: value } : {}),
      });
      findSlotsAndSynonyms(value);
    },
    [isInline]
  );

  const onDropRejected = React.useCallback(() => {
    toast.error('This file type is not supported, please upload a .CSV.');
  }, []);

  const onDropAccepted = React.useCallback(async (files: File[]) => {
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

      stateApi.update({
        editorValue,
        readingFile: false,
      });
    } catch {
      toast.error('Unable to read this document, please contact support.');
      stateApi.readingFile.set(false);
    }
  }, []);

  const onUpload = React.useCallback(() => {
    const slotsWithSynonyms = getSlotsWithSynonyms(state.editorValue);

    const [errors, validSlots] = validateSlots(slotsWithSynonyms);

    if (errors.size && !state.ignoreErrors) {
      stateApi.update({ errors, validSlots, uploadDisabled: true });
    } else if (errors.size && state.ignoreErrors && !validSlots.length) {
      toast.error("There's nothing to upload, please fix the errors.");
    } else {
      data.onUpload(validSlots);

      toast.success(
        `${pluralize('slot', validSlots.length, true)} and ${pluralize('synonym', validSlots.flatMap(_tail).length, true)} successfully imported!`
      );

      close();

      stateApi.reset();
    }
  }, [state, data]);

  const onChangeIgnoreErrors = React.useCallback(() => {
    stateApi.update({
      ignoreErrors: !state.ignoreErrors,
      ...(!state.ignoreErrors ? { uploadDisabled: false } : {}),
    });
  }, [state]);

  useDidUpdateEffect(() => {
    if (isOpened) {
      stateApi.reset();
    }
  }, [isOpened]);

  return (
    <Modal id={ModalType.IMPORT_SLOTS} maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} title="Bulk import Entities">
      <Box width="100%">
        <ModalBody>
          <Box mb={15}>
            <RadioGroup isFlat options={UPLOAD_VARIANTS} checked={state.uploadVariant} onChange={onChangeUploadVariant} />
          </Box>

          <Box mb={16}>
            {isInline || state.editorValue ? (
              <AceEditor
                key={String(isInline)}
                mode="slot"
                value={state.editorValue}
                focus
                onLoad={onLoad}
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
              <Link download target="" href={slotUploadExampleCSV}>
                Download template
              </Link>
            </Text>
          )}

          {!!state.errors?.size && (
            <>
              <Separator />

              <Errors name="entity" errors={state.errors} />

              <Separator />

              <Checkbox isFlat checked={state.ignoreErrors} onChange={onChangeIgnoreErrors}>
                Ignore failed {pluralize('entity', state.errors.size)}
              </Checkbox>

              <Separator isLast />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Box flex={1}>
            <Link href={Documentation.BULK_IMPORT_SLOTS}>See tutorial</Link>
          </Box>

          <Box mr={12}>
            <Button squareRadius onClick={close} variant={ButtonVariant.TERTIARY}>
              Cancel
            </Button>
          </Box>

          <Button squareRadius disabled={!state.editorValue.trim() || state.uploadDisabled} onClick={onUpload}>
            Upload
          </Button>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default ImportSlots;
