import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, FlexCenter, Modal, Text, toast, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slotV2';
import { useActiveProjectNLUConfig, useDispatch, useFeature, useHotkeyList, useModelTracking, useNLUImport, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as T from '@/ModalsV2/types';
import { NLUImportModel } from '@/models';

import { getDropzoneCaption, ImportType } from '../../constants';
import { IntentImportState, ModalsState } from '../../types';
import NLPLearnMoreLink from '../NLPLearnMoreLink';
import TabButton from '../TabButton';
import { FILE_EXTENSION_LABELS } from './constants';

interface ImportIntentsProps extends T.VoidInternalProps<{ importType: ImportType }> {
  tabState: ModalsState;
  setTabState: (state: ModalsState) => void;
  onChangeModalTab: (tab: ImportType) => void;
}

const ImportIntents: React.FC<ImportIntentsProps> = ({ api, tabState, setTabState, closePrevented, onChangeModalTab }) => {
  const importIntentsTabState = tabState[ImportType.INTENT] as IntentImportState;
  const nluConfig = useActiveProjectNLUConfig();
  const [file, setFile] = React.useState<File | null>(importIntentsTabState.file || null);
  const [importedModel, setImportedModel] = React.useState<NLUImportModel | null>(importIntentsTabState.importedModel || null);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const nlp = nluConfig.nlps[0];

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateFileState = (file: File | null) => {
    setFile(file);
    setTabState({ ...tabState, [ImportType.INTENT]: { importedModel, file } as IntentImportState });
  };

  const updateModelState = (data: NLUImportModel | null) => {
    setImportedModel(data);
    setTabState({ ...tabState, [ImportType.INTENT]: { file, importedModel: data } as IntentImportState });
  };

  const { isImporting, onFileChangeFactory } = useNLUImport({
    nluType: nluConfig.type,
    platform,
  });

  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const modelImportTracking = useModelTracking();
  const fileExtensions = nlp.import?.extensions || [];
  const { isEnabled: isUnclassifiedEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_UNCLASSIFIED);

  const acceptedFileFormatsLabel = React.useMemo(
    () => fileExtensions.map((fileExtension) => fileExtension.replace('.', '').toUpperCase()).join(', '),
    [fileExtensions]
  );

  const fileExtensionsLabel = React.useMemo(
    () => fileExtensions.map((fileExtension) => FILE_EXTENSION_LABELS[fileExtension] || fileExtension),
    [fileExtensions]
  );

  const finalizeImport = async (model: NLUImportModel) => {
    setIsSubmitting(true);

    try {
      const data = await client.version.patchMergeIntentsAndSlots(versionID, model);

      modelImportTracking({ nluType: nluConfig.type, importedModel: model });

      if (data) {
        await Promise.all([refreshSlots(), refreshIntents()]);
      }

      toast.success('Intents and entities imported successfully');

      api.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFileUpload = async (files: File[]) => {
    if (files.length === 0) {
      toast.error('Unable to recognize data. Please edit file format and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await onFileChangeFactory(NLUImportOrigin.NLU_MANAGER)(files);

      if (response) {
        setTabState({ ...tabState, [ImportType.INTENT]: { importedModel: response, file: files[0] } as IntentImportState });
        setFile(files[0]);
        setImportedModel(response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useHotkeyList([
    { hotkey: Hotkey.SUBMIT, callback: () => onFileChangeFactory(NLUImportOrigin.NLU_MANAGER), preventDefault: true },
    { hotkey: Hotkey.NLU_TABLE_ESC, callback: api.onClose },
  ]);

  return (
    <>
      <Modal.Header
        style={isUnclassifiedEnabled ? { padding: '12px 32px 12px 16px' } : {}}
        border={isUnclassifiedEnabled}
        actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}
      >
        {isUnclassifiedEnabled ? (
          <FlexCenter>
            <TabButton>Intents</TabButton>

            <Box ml={2}>
              <TabButton onClick={() => onChangeModalTab(ImportType.UNCLASSIFIED)} active>
                Unclassified
              </TabButton>
            </Box>
          </FlexCenter>
        ) : (
          `Import Intents`
        )}
      </Modal.Header>

      <Modal.Body>
        <Box mt={isUnclassifiedEnabled ? 25 : 0} mb={12}>
          <UploadV2.Drop
            value={file?.name || ''}
            acceptedFileTypes={fileExtensions}
            label={acceptedFileFormatsLabel}
            onDropAccepted={onFileUpload}
            isLoading={isLoading}
            onDropRejected={() => toast.error(getDropzoneCaption(nlp.name, acceptedFileFormatsLabel)(platform))}
            onRemoveFile={() => {
              updateFileState(null);
              updateModelState(null);
            }}
            renderValue={({ value }) => (
              <UploadV2.DropContent
                value={value}
                onRemove={() => {
                  updateFileState(null);
                  updateModelState(null);
                }}
              />
            )}
          />
        </Box>

        {!importedModel ? (
          <Text color="#62778C" fontSize={13}>
            <NLPLearnMoreLink platform={platform} nlp={nlp} fileExtensions={fileExtensionsLabel} />
          </Text>
        ) : (
          <Text color="#62778C" fontSize={13}>
            {importedModel.intents.length} intents containing {importedModel.slots.length} entities added.
          </Text>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button
          onClick={() => finalizeImport(importedModel!)}
          disabled={isSubmitting || isLoading || isImporting || !importedModel || closePrevented}
          squareRadius
          isLoading={isSubmitting}
          style={isSubmitting ? { width: '136px' } : {}}
        >
          Add to Model
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ImportIntents;
