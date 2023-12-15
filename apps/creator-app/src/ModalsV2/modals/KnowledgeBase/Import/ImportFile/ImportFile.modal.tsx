import { Box, UploadArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import modalsManager from '../../../../manager';
import { FieldLabel } from '../components/FieldLabel/FieldLabel.component';
import { ACCEPT_TYPES } from './ImportFile.constant';
import { submitButtonStyles, uploadAreaStyles } from './ImportFile.css';

interface ImportFileProps {
  onSave: (files: File[]) => Promise<void>;
}

export const ImportFile = modalsManager.create<ImportFileProps>(
  'KBImportFile',
  () =>
    ({ onSave, api, type, opened, hidden, animated, closePrevented }) => {
      const [files, setFiles] = React.useState<File[] | undefined>(undefined);
      const [submissionError, setSubmissionError] = React.useState(false);

      const caption = React.useMemo(() => {
        if (submissionError) return '';

        if (files?.length === 1) {
          const fileSize = (files[0].size / (1024 * 1024)).toFixed(2);

          return `${fileSize}mb file successfully uploaded.`;
        }

        if (files?.length && files.length > 1) {
          return `${files?.length} files successfully uploaded.`;
        }

        return 'Supported file types: pdf, txt, docx - 10mb max.';
      }, [files, submissionError]);

      const onImport = async () => {
        if (!files?.length) return;

        try {
          api.preventClose();

          await onSave(files);

          api.enableClose();
          api.close();
        } finally {
          api.enableClose();
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

          <Box direction="column" mt={20} mb={24} mx={24} gap={16}>
            <div>
              <FieldLabel>File(s)</FieldLabel>

              <UploadArea
                files={files}
                label="Drop file(s) here or"
                error={false}
                variant="secondary"
                caption={caption}
                onUpload={setFiles}
                disabled={closePrevented}
                maxFiles={100}
                className={uploadAreaStyles}
                errorMessage={submissionError && !closePrevented ? 'File is invalid.' : undefined}
                acceptedFileTypes={ACCEPT_TYPES}
                onCloseButtonClick={() => setFiles(undefined)}
              />
            </div>
          </Box>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} />

            <Modal.Footer.Button
              label={closePrevented ? '' : 'Import'}
              onClick={onSubmit}
              disabled={closePrevented || !files?.length}
              isLoading={closePrevented}
              className={submitButtonStyles}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
