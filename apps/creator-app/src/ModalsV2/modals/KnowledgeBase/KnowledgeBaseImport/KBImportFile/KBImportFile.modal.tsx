import { tid } from '@voiceflow/style';
import { Box, notify, Scroll, UploadArea } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { MEDIA_FILE_TYPES, MediaMimeType } from '@/constants/media.constant';
import { Designer } from '@/ducks';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';

import modalsManager from '../../../../manager';
import { KBFieldLabel } from '../components/KBFieldLabel/KBFieldLabel.component';
import { uploadAreaStyles } from './KBImportFile.css';

export const KBImportFile = modalsManager.create('KBImportFile', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const TEST_ID = tid('knowledge-base', 'import-file-modal');

  const fileSizeLimitMB = 10;

  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS, { limit: 5000 });
  const upgradeModal = useUpgradeModal();

  const createManyFromFile = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromFile);

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const caption = React.useMemo(() => {
    if (files?.length === 1) {
      const fileSize = (files[0].size / (1024 * 1024)).toFixed(2);

      return `${fileSize}mb file successfully uploaded.`;
    }

    if (files?.length && files.length > 1) {
      return `${files?.length} files successfully uploaded.`;
    }

    return `Supported file types: pdf, txt, docx - ${fileSizeLimitMB}mb max.`;
  }, [files]);

  const onUpload = (files: File[]) => {
    const hasSizeError = files.some((file) => file.size > fileSizeLimitMB * 1024 * 1024);

    if (hasSizeError) {
      setError('File size exceeds 10mb.');
      throw new Error('File size exceeds 10mb.');
    }

    if (files.length === 0) {
      setError('File not supported.');
      throw new Error('File type is not supported.');
    }

    setError('');
    setFiles(files);
  };

  const onImport = async () => {
    if (!files?.length) return;

    try {
      api.preventClose();

      await createManyFromFile(files)
        .then(() => {
          api.enableClose();
          api.close();
          return null;
        })
        .catch((error) => {
          if (error.response.status === 406 && planConfig) {
            const limit = error.response.data.kbDocsLimit;
            notify.long.warning(`Document limit (${limit}) reached for your current subscription. Please upgrade to continue.`, {
              actionButtonProps: { label: 'Upgrade', onClick: () => upgradeModal.openVoid(planConfig.upgradeModal({ limit })) },
              bodyStyle: {
                color: Tokens.colors.neutralDark.neutralsDark900,
                fontSize: Tokens.typography.size[14],
                lineHeight: Tokens.typography.lineHeight[20],
                fontFamily: Tokens.typography.family.regular,
              },
            });
          } else {
            notify.short.error('Failed to import data sources');
          }
          api.enableClose();
        });
    } finally {
      api.enableClose();
    }
  };

  const onClear = () => {
    setFiles([]);
    setError('');
  };

  const onSubmit = () => {
    if (!files.length) {
      setError('File(s) are required.');
    } else {
      onImport();
    }
  };

  return (
    <Modal.Container
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      onEscClose={api.onEscClose}
      onEnterSubmit={onSubmit}
      testID={TEST_ID}
    >
      <Modal.Header title="Import file" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

      <Scroll style={{ display: 'block' }}>
        <Box direction="column" mt={20} mb={24} mx={24} gap={6}>
          <div>
            <Box mb={6}>
              <KBFieldLabel>File(s)</KBFieldLabel>
            </Box>
            <UploadArea
              files={files.length ? files : undefined}
              label="Drop file(s) here or"
              error={!!error}
              variant="secondary"
              caption={error ? undefined : caption}
              onUpload={onUpload}
              disabled={closePrevented}
              maxFiles={100}
              className={uploadAreaStyles}
              errorMessage={error}
              acceptedFileTypes={{
                [MediaMimeType.TEXT_PLAIN]: MEDIA_FILE_TYPES.TXT,
                [MediaMimeType.APPLICATION_PDF]: MEDIA_FILE_TYPES.PDF,
                [MediaMimeType.APPLICATION_DOCX]: MEDIA_FILE_TYPES.DOCX,
                [MediaMimeType.APPLICATION_MSWORD]: MEDIA_FILE_TYPES.DOC,
              }}
              onCloseButtonClick={onClear}
              testID={tid(TEST_ID, 'file')}
            />
          </div>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} testID={tid(TEST_ID, 'cancel')} />

        <Modal.Footer.Button label="Import" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} testID={tid(TEST_ID, 'import')} />
      </Modal.Footer>
    </Modal.Container>
  );
});
