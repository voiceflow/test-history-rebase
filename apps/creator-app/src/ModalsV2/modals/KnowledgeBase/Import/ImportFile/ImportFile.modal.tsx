import { Box, Text, UploadArea } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import modalsManager from '../../../../manager';
import { ACCEPT_TYPES } from './ImportFile.constant';
import { labelStyles, submitButtonStyles, uploadAreaStyles } from './ImportFile.css';

interface ImportFileProps {
  save: (files: File[]) => Promise<void>;
}

export const ImportFile = modalsManager.create<ImportFileProps>('KBImportFile', () => ({ save, api, type, opened, hidden, animated }) => {
  const [files, setFiles] = React.useState<File[] | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState(false);

  const caption = React.useMemo(() => {
    if (submissionError) return '';

    if (files?.length === 1) {
      const fileSize = (files[0].size / (1024 * 1024)).toFixed(2);

      return `${fileSize}MB file successfully uploaded.`;
    }

    if (files?.length && files.length > 1) {
      return `${files?.length} files successfully uploaded.`;
    }

    return 'Supported file types: pdf, txt, docx - 10mb max.';
  }, [files, submissionError]);

  const onImport = async () => {
    if (!files?.length) return;

    try {
      setLoading(true);

      await save(files);

      setLoading(false);
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
    <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
      <Modal.Header title="Import file" onClose={api.close} />

      <Box direction="column" mt={20} mb={24} mx={24} gap={16}>
        <div>
          <Text variant="fieldLabel" className={labelStyles}>
            File(s)
          </Text>

          <UploadArea
            files={files}
            label="Drop file(s) here or"
            error={false}
            variant="secondary"
            caption={caption}
            onUpload={setFiles}
            disabled={loading}
            maxFiles={100}
            className={uploadAreaStyles}
            errorMessage={submissionError && !loading ? 'File is invalid.' : undefined}
            acceptedFileTypes={ACCEPT_TYPES}
            onCloseButtonClick={() => setFiles(undefined)}
          />
        </div>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.close} />

        <Modal.Footer.Button
          label={loading ? '' : 'Import'}
          onClick={onSubmit}
          disabled={loading}
          isLoading={loading}
          className={submitButtonStyles}
        />
      </Modal.Footer>
    </Modal.Container>
  );
});
