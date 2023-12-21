import { Box, UploadArea } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';
import { MEDIA_FILE_TYPES, MediaMimeType } from '@/constants/media.constant';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import modalsManager from '../../../../manager';
import { KBFieldLabel } from '../components/KBFieldLabel/KBFieldLabel.component';
import { uploadAreaStyles } from './KBImportFile.css';

export const KBImportFile = modalsManager.create('KBImportFile', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const fileSizeLimitMB = 10;

  const createManyFromFile = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromFile);

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const onUpload = (files: File[]) => {
    const hasSizeError = files.some((file) => file.size > fileSizeLimitMB * 1024 * 1024);

    if (hasSizeError) {
      setError('File size exceeds 10mb.');
    } else {
      setError('');
      setFiles(files);
    }
  };

  const onImport = async () => {
    if (!files?.length) return;

    try {
      api.preventClose();

      await createManyFromFile(files);

      api.enableClose();
      api.close();
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
      setError('Please upload a file.');
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
    >
      <Modal.Header title="Import file" onClose={api.onClose} />

      <Box direction="column" mt={20} mb={24} mx={24} gap={6}>
        <KBFieldLabel>File(s)</KBFieldLabel>

        <UploadArea
          files={files.length ? files : undefined}
          label="Drop file(s) here or"
          error={!!error}
          variant="secondary"
          caption={error ? undefined : `Supported file types: pdf, txt, docx - ${fileSizeLimitMB}mb max.`}
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
        />
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} />

        <Modal.Footer.Button label="Import" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
      </Modal.Footer>
    </Modal.Container>
  );
});
