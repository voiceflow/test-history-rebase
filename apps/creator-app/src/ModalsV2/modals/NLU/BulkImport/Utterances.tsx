import { Box, Button, ButtonVariant, Checkbox, Modal, System, Text, toast, Upload, useSmartReducerV2 } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import { utteranceUploadExampleCSV } from '@/assets';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import { useDebouncedCallback, useSelector, useTrackingEvents } from '@/hooks';
import { useAllEntitiesSelector } from '@/hooks/entity.hook';
import { readFileAsText } from '@/utils/file';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import manager from '../../../manager';
import { Errors } from './components';
import { ACCEPTED_FILE_TYPES, DEBOUNCE_TIMEOUT, FILE_SIZE_LIMIT_BYTES, FILE_SIZE_LIMIT_KB, UPLOAD_VARIANTS, UploadType } from './constants';
import * as S from './styles';
import { getUniqSlots, getUtterances, validateUtterances } from './utils';

interface Utterance {
  text: string;
  slots: string[];
}

export interface Result {
  utterances: Utterance[];
}

export interface Props {
  intentID: string | null;
}

const Utterances = manager.create<Props, Result>('BulkImportUtterances', () => ({ api, type, opened, hidden, animated, intentID }) => {
  const slots = useAllEntitiesSelector();
  const intents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
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
    validUtterances: [] as Utterance[],
  });
  const isInline = state.uploadVariant === UploadType.INLINE;

  const builtIn = isCustomizableBuiltInIntent(getIntentByID({ id: intentID }));

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

  const onUpload = () => {
    const [errors, validUtterances] = validateUtterances({
      slots,
      intents,
      builtIn,
      intentID,
      platform,
      utterances: getUtterances(state.editorValue),
    });

    if (errors.size && !state.ignoreErrors) {
      stateApi.update({ errors, validUtterances, uploadDisabled: true });
    } else if (errors.size && state.ignoreErrors && !validUtterances.length) {
      toast.error("There's nothing to upload, please fix the errors.");
    } else {
      api.resolve({ utterances: validUtterances });
      api.close();

      trackingEvents.trackNewUtteranceCreated({
        intentID: intentID ?? 'new-intent',
        creationType: Tracking.CanvasCreationType.UTTERANCE_UPLOAD,
      });

      toast.success(`${pluralize('utterance', validUtterances.length, true)} successfully imported!`);
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
      <Modal.Header>Bulk import Utterances</Modal.Header>

      <Modal.Body>
        <Box mb={15}>
          <RadioGroup isFlat options={UPLOAD_VARIANTS} checked={state.uploadVariant} onChange={onChangeUploadVariant} />
        </Box>

        <Box mb={16}>
          {isInline || state.editorValue ? (
            <S.AceEditor
              key={String(isInline)}
              mode={builtIn ? ' ' : 'utterance'}
              value={state.editorValue}
              focus
              onLoad={(editor) => editor.renderer.setPadding(12)}
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
            <System.Link.Anchor download target="" href={utteranceUploadExampleCSV}>
              Download template
            </System.Link.Anchor>
          </Text>
        )}

        {!!state.errors?.size && (
          <>
            <S.Separator />

            <Errors name="utterance" errors={state.errors} />

            <S.Separator />

            <Checkbox isFlat checked={state.ignoreErrors} onChange={onChangeIgnoreErrors}>
              Ignore failed {pluralize('utterance', state.errors.size)}
            </Checkbox>

            <S.Separator isLast />
          </>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Box flex={1}>
          <System.Link.Anchor href={Documentation.BULK_IMPORT_UTTERANCES}>See tutorial</System.Link.Anchor>
        </Box>

        <Button squareRadius onClick={api.close} variant={ButtonVariant.TERTIARY}>
          Cancel
        </Button>

        <Button squareRadius disabled={!state.editorValue.trim() || state.uploadDisabled} onClick={onUpload}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Utterances;
