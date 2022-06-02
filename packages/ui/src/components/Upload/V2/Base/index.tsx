import Tabs from '@ui/components/Tabs';
import { toast } from '@ui/components/Toast';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { UPLOAD_ERROR } from '../../constants';
import { UploadFileType } from '../../Context';
import { SingleUploadConfig, useUpload } from '../../useUpload';
import { hasVariables } from '../../utils';
import Drop from '../Drop';
import LinkInput, { InputRenderer } from '../LinkInput';
import * as S from './styles';

enum TabType {
  UPLOAD,
  LINK,
}

const tabs = [
  { label: 'Upload', type: TabType.UPLOAD },
  { label: 'Link', type: TabType.LINK },
];

interface ValueRendererProps {
  value: string;
  openFileSelection: () => void;
}

export interface UploadBaseProps {
  acceptedFileTypes?: string[];
  endpoint: string;
  fileType: UploadFileType;
  label: string;
  linkInputPlaceholder: string;
  onChange: (value: string | null) => void;
  renderInput?: InputRenderer;
  renderValue: (props: ValueRendererProps) => JSX.Element;
  rootDropAreaProps?: S.RootDropAreaProps;
  value: string | null;
  validateLink?: (value: string) => string | null | Promise<null>;
}

const UploadBase: React.FC<UploadBaseProps & SingleUploadConfig> = ({
  acceptedFileTypes = [],
  endpoint,
  fileType,
  label,
  linkInputPlaceholder,
  onChange,
  renderInput,
  renderValue,
  rootDropAreaProps,
  validate,
  validateLink,
  value,
}) => {
  const onError = React.useCallback(
    (message: string) => {
      let finalMessage = message;

      if (message === UPLOAD_ERROR.INVALID_FILE_TYPE) {
        finalMessage = `File type not support. ${acceptedFileTypes.join(', ')} file types are supported`;
      }

      toast.custom('error', 'warning', '#bd425f')(finalMessage);
    },
    [acceptedFileTypes]
  );

  const valueHasVariable = value ? hasVariables(value) : false;
  const [activeTab, setActiveTab] = React.useState(valueHasVariable ? TabType.LINK : TabType.UPLOAD);
  const { onDropAccepted, onDropRejected, isLoading, error, setError } = useUpload({ fileType, endpoint, validate, update: onChange, onError });

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes.toString(),
    disabled: !!isLoading,
    onDropAccepted,
    onDropRejected,
  });

  const { onClick, ...rootProps } = getRootProps();

  const hasDisplayableValue = !!value && !valueHasVariable;
  const shouldDisplayDropArea = activeTab === TabType.UPLOAD || hasDisplayableValue;

  return (
    <S.Container>
      <Tabs value={activeTab} onChange={setActiveTab}>
        {tabs.map(({ label, type }) => (
          <Tabs.Tab key={type} value={type}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs>
      {activeTab === TabType.LINK && (
        <LinkInput value={value} renderInput={renderInput} placeholder={linkInputPlaceholder} onChangeText={onChange} validate={validateLink} />
      )}

      {shouldDisplayDropArea && (
        <S.RootDropArea {...rootDropAreaProps} {...rootProps} onContextMenu={(event) => event.stopPropagation()}>
          <input style={{ display: 'none' }} {...getInputProps()} />

          {activeTab === TabType.UPLOAD && !hasDisplayableValue && (
            <S.DropContainer onClick={(event) => (error ? setError(null) : onClick(event))}>
              <Drop isDragActive={isDragActive} isDragReject={isDragReject} label={label} isLoading={isLoading} error={error} />
            </S.DropContainer>
          )}

          {hasDisplayableValue && renderValue({ value, openFileSelection: onClick })}
        </S.RootDropArea>
      )}
    </S.Container>
  );
};

export default UploadBase;
