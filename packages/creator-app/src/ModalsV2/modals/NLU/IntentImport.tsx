import { Box, Button, Modal, SvgIcon, Text, toast, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as NLU from '@/config/nlu';
import { NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useActiveProjectNLUConfig, useDispatch, useHotKeys, useModelTracking, useNLUImport, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';
import { NLUImportModel } from '@/models';

import manager from '../../manager';
import { getDropzoneCaption } from './constants';
import * as S from './styles';

const IntentImport = manager.create('NLUImportIntents', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const nluConfig = useActiveProjectNLUConfig();
  const [file, setFile] = React.useState<File | null>(null);
  const [importedModel, setImportedModel] = React.useState<NLUImportModel | null>(null);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const nlp = NLU.Config.get(platform).nlps[0];
  const fileExtensions = nlp.import?.extensions || [];
  const {
    isImporting,
    onFileChangeFactory: onImport,
    acceptedFileFormatsLabel,
  } = useNLUImport({
    nluType: nluConfig.type,
    platform,
    onImport: setImportedModel!,
  });
  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const modelImportTracking = useModelTracking();

  const finalizeImport = async (model: NLUImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, model);

    modelImportTracking({ nluType: nluConfig.type, importedModel: model });

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
    api.close();
  };

  const onFileUpload = async (files: File[]) => {
    if (files.length === 0) {
      toast.error('Unable to recognize data. Please edit file format and try again.');
      return;
    }
    setFile(files[0]);
    onImport(NLUImportOrigin.NLU_MANAGER)(files);
  };

  useHotKeys(Hotkey.SUBMIT, () => onImport(NLUImportOrigin.NLU_MANAGER), { preventDefault: true });
  useHotKeys(Hotkey.NLU_TABLE_ESC, api.close);

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButton onClick={() => api.close()} />}>Intents</Modal.Header>

      <Modal.Body>
        <Box mt={20} mb={12}>
          <UploadV2.Drop
            value={file?.name || undefined}
            hasDisplayableValue={!!file}
            acceptedFileTypes={fileExtensions}
            label={acceptedFileFormatsLabel}
            onDropAccepted={onFileUpload}
            onDropRejected={() => toast.error(getDropzoneCaption(nlp.name, acceptedFileFormatsLabel)(platform))}
            renderValue={() => {
              return (
                <S.Container>
                  <SvgIcon icon="checkSquare" color="#38751F" style={{ marginRight: 25 }} />
                  <Text style={{ color: '#132144' }}>{file?.name}</Text>
                </S.Container>
              );
            }}
          />
        </Box>

        {!(importedModel && importedModel.intents.length > 0) ? (
          <Text color="#62778C" fontSize={13}>
            {getDropzoneCaption(nlp.name, acceptedFileFormatsLabel)(platform)}
          </Text>
        ) : (
          <Text color="#62778C" fontSize={13}>
            {importedModel.intents.length} intents containing {importedModel.slots.length} added.
          </Text>
        )}
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={() => finalizeImport(importedModel!)} disabled={isImporting && !importedModel && closePrevented} squareRadius>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default IntentImport;
