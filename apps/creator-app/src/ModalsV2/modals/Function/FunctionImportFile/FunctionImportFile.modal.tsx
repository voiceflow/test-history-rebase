import { Box, UploadArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import modalsManager from '../../../manager';
import { ACCEPT_TYPES } from './FunctionImportFile.constant';
import { submitButtonStyles, uploadAreaStyles } from './FunctionImportFile.css';

interface ImportFileProps {
  onSave: (files: File[]) => void;
}

export const FunctionImportFile = modalsManager.create<ImportFileProps>(
  'FunctionImportFile',
  () =>
    ({ onSave, api, type, opened, hidden, animated }) => {
      const [files, setFiles] = React.useState<File[] | undefined>(undefined);
      const [loading, setLoading] = React.useState(false);
      const [submissionError, setSubmissionError] = React.useState(false);

      const caption = React.useMemo(() => {
        if (submissionError) return '';

        if (files?.length === 1) {
          const fileSize = (files[0].size / 1024).toFixed(2);

          return `${fileSize}KB file successfully uploaded.`;
        }

        if (files?.length && files.length > 1) {
          return `${files?.length} files successfully uploaded.`;
        }

        return 'Supported file type: json - 1mb max.';
      }, [files, submissionError]);

      const onImport = async () => {
        if (!files?.length) return;

        try {
          setLoading(true);
          await onSave(files);
          api.close();
        } finally {
          setLoading(false);
        }
      };

      const onSubmit = () => {
        if (!files?.length) {
          setSubmissionError(true);
        } else {
          setSubmissionError(false);
          onImport();
        }
      };

      React.useEffect(() => {
        if (!submissionError) return undefined;

        const timeout = setTimeout(() => setSubmissionError(false), 2000);

        return () => clearTimeout(timeout);
      }, [submissionError]);

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header title="Import file" onClose={api.onClose} />

          <Box direction="column" mt={20} mb={24} mx={24} gap={16}>
            <div>
              <UploadArea
                files={files}
                label="Drop file here or"
                error={false}
                variant="secondary"
                caption={caption}
                onUpload={setFiles}
                disabled={loading}
                maxFiles={1}
                maxFileSize={1024 * 1024}
                className={uploadAreaStyles}
                errorMessage={submissionError && !loading ? 'File is invalid.' : undefined}
                acceptedFileTypes={ACCEPT_TYPES}
                onCloseButtonClick={() => setFiles(undefined)}
              />
            </div>
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} />

            <Modal.Footer.Button
              label={loading ? '' : 'Import'}
              onClick={onSubmit}
              disabled={loading || !files?.length}
              isLoading={loading}
              className={submitButtonStyles}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
