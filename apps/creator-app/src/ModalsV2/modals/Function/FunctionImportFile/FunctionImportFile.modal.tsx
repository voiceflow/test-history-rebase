import { Box, UploadArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useState } from 'react';

import { Modal } from '@/components/Modal';

import modalsManager from '../../../manager';
import { ACCEPT_TYPES } from './FunctionImportFile.constant';
import { uploadAreaStyles } from './FunctionImportFile.css';

interface ImportFileProps {
  onSave: (files: File[]) => void;
}

export const FunctionImportFile = modalsManager.create<ImportFileProps>(
  'FunctionImportFile',
  () =>
    ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
      const fileSizeLimitMB = 1;

      const [files, setFiles] = useState<File[]>([]);
      const [error, setError] = useState('');

      const caption = React.useMemo(() => {
        if (files?.length === 1) {
          const fileSize = (files[0].size / 1024).toFixed(2);

          return `${fileSize}KB file successfully uploaded.`;
        }

        if (files?.length && files.length > 1) {
          return `${files?.length} files successfully uploaded.`;
        }

        return `Supported file types: json - ${fileSizeLimitMB}mb max.`;
      }, [files]);

      const onUpload = (files: File[]) => {
        const hasSizeError = files.some((file) => file.size > fileSizeLimitMB * 1024 * 1024);

        if (hasSizeError) {
          setError('File size exceeds 1mb.');
          throw new Error('File size exceeds 1mb.');
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

          await onSave(files);
        } finally {
          api.enableClose();
          api.close();
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
        >
          <Modal.Header title="Import function(s)" onClose={api.onClose} />

          <Box direction="column" mt={20} mb={24} mx={24} gap={2}>
            <UploadArea
              files={files.length ? files : undefined}
              label="Drop .json file(s) here or"
              error={!!error}
              variant="secondary"
              caption={error ? undefined : caption}
              onUpload={onUpload}
              disabled={closePrevented}
              maxFiles={100}
              className={uploadAreaStyles}
              errorMessage={error}
              acceptedFileTypes={ACCEPT_TYPES}
              onCloseButtonClick={onClear}
            />
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} />

            <Modal.Footer.Button
              label={files.length ? `Import ${pluralize('function', files.length, true)}` : 'Import'}
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
