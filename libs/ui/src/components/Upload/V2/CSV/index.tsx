import { toast } from '@ui/components/Toast';
import { readCSVFile } from '@ui/utils';
import React from 'react';

import { UPLOAD_ERROR } from '../../constants';
import UploadDrop, { DropContent, UploadDropProps } from '../Drop';
import { InputRenderer } from '../LinkInput';

export interface CSVFile {
  data: string[];
  fileName: string;
}

export interface UploadCSVProps extends Pick<UploadDropProps, 'value'> {
  renderInput?: InputRenderer;
  onlyUpload?: boolean;
  onReadFile?: (file: CSVFile) => void;
  onUpload?: (files: File[]) => void;
  onRemove: VoidFunction;
}

const ACCEPTED_FILE_TYPES = ['.csv'];

const UploadCSV: React.FC<UploadCSVProps> = ({ value, onReadFile, onUpload, onRemove }) => {
  const [error, setError] = React.useState<null | string>(null);

  const onDropAccepted = async (acceptedFiles: File[]) => {
    if (onUpload) onUpload(acceptedFiles);
    if (!onReadFile) return;

    try {
      const csvFile = await readCSVFile(acceptedFiles[0]);
      onReadFile(csvFile);
    } catch (e) {
      toast.error('Invalid CSV Format');
    }
  };

  return (
    <UploadDrop
      onDropAccepted={onDropAccepted}
      onDropRejected={() => setError(UPLOAD_ERROR.INVALID_FILE_TYPE)}
      value={value}
      acceptedFileTypes={ACCEPTED_FILE_TYPES}
      label="CSV file"
      setError={setError}
      error={error}
      onRemoveFile={onRemove}
      renderValue={({ value }) => <DropContent value={value} onRemove={onRemove} />}
      hasDisplayableValue={!!value}
    />
  );
};

export default UploadCSV;
