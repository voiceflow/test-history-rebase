import { Box, Button, ButtonVariant, Checkbox, Link, Text, toast, Upload, useDidUpdateEffect, useSmartReducerV2 } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import { utteranceUploadExampleCSV } from '@/assets';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDebouncedCallback, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { readFileAsText } from '@/utils/file';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import { AceEditor, Errors, Separator } from './components';
import { ACCEPTED_FILE_TYPES, FILE_SIZE_LIMIT_BYTES, FILE_SIZE_LIMIT_KB, UPLOAD_VARIANTS, UploadType } from './constants';
import { getUniqSlots, getUtterances, validateUtterances } from './utils';

const DEBOUNCE_TIMEOUT = 300;

const ImportUtterances: React.FC = () => {
  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);

  const [state, stateApi] = useSmartReducerV2({
    errors: null as null | Map<number, string>,
    slotsCount: 0,
    readingFile: false,
    editorValue: '',
    inlineValue: '',
    ignoreErrors: false,
    uploadVariant: UploadType.INLINE,
    uploadDisabled: false,
    utterancesCount: 0,
    validUtterances: [] as { text: string; slots: string[] }[],
  });
  const isInline = state.uploadVariant === UploadType.INLINE;
  const platform = useSelector(ProjectV2.active.platformSelector);

  const { close, data, isOpened } = useModals<{ intentID: string; onUpload: (utterances: { text: string; slots: string[] }[]) => void }>(
    ModalType.IMPORT_UTTERANCES
  );

  const builtIn = isCustomizableBuiltInIntent(getIntentByID({ id: data.intentID }));

  const [trackingEvents] = useTrackingEvents();

  const findSlotsAndUtterances = useDebouncedCallback(
    DEBOUNCE_TIMEOUT,
    (value: string) => {
      const uniqSlots = getUniqSlots(value);
      const utterances = getUtterances(value);

      stateApi.update({
        slotsCount: uniqSlots.length,
        utterancesCount: utterances.length,
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
      slotsCount: 0,
      editorValue: '',
      ignoreErrors: false,
      uploadVariant: variant,
      uploadDisabled: false,
      utterancesCount: 0,
      validUtterances: [],
    });
  }, []);

  const onChange = React.useCallback(
    (value: string) => {
      stateApi.update({
        editorValue: value,
        uploadDisabled: false,
        ...(isInline ? { inlineValue: value } : {}),
      });
      findSlotsAndUtterances(value);
    },
    [isInline]
  );

  const onDropRejected = React.useCallback(() => {
    toast.error('This file type is not supported, please upload a .CSV');
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

      const editorValue = getUtterances(value).join('\n');

      findSlotsAndUtterances(editorValue);
      findSlotsAndUtterances.flush();

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
    const [errors, validUtterances] = validateUtterances({
      utterances: getUtterances(state.editorValue),
      intentID: data.intentID,
      intents,
      slots,
      builtIn,
      platform,
    });

    if (errors.size && !state.ignoreErrors) {
      stateApi.update({ errors, validUtterances, uploadDisabled: true });
    } else if (errors.size && state.ignoreErrors && !validUtterances.length) {
      toast.error("There's nothing to upload, please fix the errors.");
    } else {
      data.onUpload(validUtterances);

      toast.success(`${pluralize('utterance', validUtterances.length, true)} successfully imported!`);

      trackingEvents.trackNewUtteranceCreated({ intentID: data.intentID, creationType: Tracking.CanvasCreationType.UTTERANCE_UPLOAD });

      close();

      stateApi.reset();
    }
  }, [state, data, slots, intents, builtIn]);

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
    <Modal id={ModalType.IMPORT_UTTERANCES} maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} title="Bulk import Utterances">
      <Box width="100%">
        <ModalBody>
          <Box mb={15}>
            <RadioGroup isFlat options={UPLOAD_VARIANTS} checked={state.uploadVariant} onChange={onChangeUploadVariant} />
          </Box>

          <Box mb={16}>
            {isInline || state.editorValue ? (
              <AceEditor
                key={String(isInline)}
                mode={builtIn ? ' ' : 'utterance'}
                value={state.editorValue}
                focus
                onLoad={onLoad}
                onChange={onChange}
                placeholder={
                  builtIn ? 'One utterance per line, built-in intents do not support entities' : 'One utterance per line, wrap entities in {}'
                }
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
              {state.utterancesCount} <Text color="#62778c">{pluralize('utterance', state.utterancesCount)} </Text>
              {!builtIn && (
                <>
                  <Text>with</Text> {state.slotsCount} <Text color="#62778c">{pluralize('entity', state.slotsCount)} included.</Text>
                </>
              )}
            </Text>
          ) : (
            <Text color="#62778c" fontSize={13}>
              {builtIn ? <>On sample utterance per row. </> : <> One sample utterance per row, wrap entities in {'{}'}. </>}
              <Link download target="" href={utteranceUploadExampleCSV}>
                Download template
              </Link>
            </Text>
          )}

          {!!state.errors?.size && (
            <>
              <Separator />

              <Errors name="utterance" errors={state.errors} />

              <Separator />

              <Checkbox isFlat checked={state.ignoreErrors} onChange={onChangeIgnoreErrors}>
                Ignore failed {pluralize('utterance', state.errors.size)}
              </Checkbox>

              <Separator isLast />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Box flex={1}>
            <Link href={Documentation.BULK_IMPORT_UTTERANCES}>See tutorial</Link>
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

export default ImportUtterances;
