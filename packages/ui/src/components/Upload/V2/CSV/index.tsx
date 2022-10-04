import { toast } from '@ui/components/Toast';
import { readCSVFile } from '@ui/utils';
import React from 'react';

import { UPLOAD_ERROR } from '../../constants';
import UploadDrop, { UploadDropProps } from '../Drop';
import { InputRenderer } from '../LinkInput';
import * as S from './styles';

export interface CSVFile {
  data: string[];
  fileName: string;
}

export interface UploadCSVProps extends Pick<UploadDropProps, 'value'> {
  renderInput?: InputRenderer;
  onlyUpload?: boolean;
  onChange: (file: CSVFile) => void;
  onClose: VoidFunction;
}

const ACCEPTED_FILE_TYPES = ['.csv'];

const UploadCSV: React.FC<UploadCSVProps> = ({ onChange, value }) => {
  const [error, setError] = React.useState<null | string>(null);

  const onDropAccepted = async (acceptedFiles: File[]) => {
    try {
      const { data, fileName } = await readCSVFile(acceptedFiles[0]);
      onChange({ data, fileName });
    } catch (e) {
      toast.error('Invalid CSV Format');
    }
  };

  return (
    <UploadDrop
      hasDisplayableValue={!!value}
      renderValue={({ value }) => (
        <S.Container>
          <S.StatusButton size={16} icon="checkSquare" />
          {value}
        </S.Container>
      )}
      onDropAccepted={onDropAccepted}
      onDropRejected={() => setError(UPLOAD_ERROR.INVALID_FILE_TYPE)}
      value={value}
      acceptedFileTypes={ACCEPTED_FILE_TYPES}
      label="CSV file"
      setError={setError}
      error={error}
    />
  );
};

export default UploadCSV;
