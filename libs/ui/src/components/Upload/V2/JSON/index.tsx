import { toast } from '@ui/components/Toast';
import { readJSONFile } from '@ui/utils';
import React from 'react';

import { UPLOAD_ERROR } from '../../constants';
import type { UploadDropProps } from '../Drop';
import UploadDrop from '../Drop';
import type { InputRenderer } from '../LinkInput';
import * as S from './styles';

interface JSONFile {
  data: {
    document?: object | undefined;
    datasources?: object | undefined;
  };
  fileName: string;
}

export interface UploadJSONProps extends Pick<UploadDropProps, 'value'> {
  renderInput?: InputRenderer;
  onlyUpload?: boolean;
  onChange: (file: JSONFile) => void;
  onClose: VoidFunction;
}

const ACCEPTED_FILE_TYPES = ['.json', '.JSON', 'application/json'];

const UploadJSON: React.FC<UploadJSONProps> = ({ onChange, onClose, value }) => {
  const [error, setError] = React.useState<null | string>(null);

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const fileReader = new FileReader();

    fileReader.onerror = () => toast.error('Unable to read JSON file.');

    fileReader.onloadend = (event) => {
      try {
        const file = readJSONFile<{ document?: object; datasources?: object }>(acceptedFiles[0], event.target!, [
          'document',
          'datasources',
        ]);

        onChange(file);
      } catch {
        toast.error('Invalid JSON Format');
      }
    };

    fileReader.readAsText(acceptedFiles[0]);
  };

  return (
    <UploadDrop
      hasDisplayableValue={!!value}
      renderValue={({ value }) => (
        <S.Container>
          <S.CornerActionButton onClick={onClose} size={8.5} icon="closeSmall" />
          <S.StatusButton size={16} icon="checkSquare" />
          {value.replace('.json', '.JSON')}
        </S.Container>
      )}
      onDropAccepted={onDropAccepted}
      onDropRejected={() => setError(UPLOAD_ERROR.INVALID_FILE_TYPE)}
      value={value}
      acceptedFileTypes={ACCEPTED_FILE_TYPES}
      label="JSON"
      setError={setError}
      error={error}
    />
  );
};

export default UploadJSON;
