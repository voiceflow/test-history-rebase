import Tabs from '@ui/components/Tabs';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { UploadFileType } from '../../Context';
import { SingleUploadConfig, useUpload } from '../../useUpload';
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
  value: string | null;
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
  validate,
  value,
}) => {
  const [activeTab, setActiveTab] = React.useState(TabType.UPLOAD);
  const { onDropAccepted, onDropRejected, isLoading } = useUpload({ fileType, endpoint, validate, update: onChange });

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: acceptedFileTypes.toString(),
    disabled: !!isLoading,
    onDropAccepted,
    onDropRejected,
  });

  const { onClick, ...rootProps } = getRootProps();

  return (
    <S.Container>
      <Tabs value={activeTab} onChange={setActiveTab}>
        {tabs.map(({ label, type }) => (
          <Tabs.Tab key={type} value={type}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs>
      {activeTab === TabType.LINK && <LinkInput value={value} renderInput={renderInput} placeholder={linkInputPlaceholder} onChangeText={onChange} />}
      <S.RootDropArea {...rootProps} onContextMenu={(event) => event.stopPropagation()}>
        <input style={{ display: 'none' }} {...getInputProps()} />
        {activeTab === TabType.UPLOAD && !value && (
          <S.DropContainer onClick={onClick}>
            <Drop isDragActive={isDragActive} isDragReject={isDragReject} label={label} isLoading={isLoading} />
          </S.DropContainer>
        )}
        {!!value && renderValue({ value, openFileSelection: onClick })}
      </S.RootDropArea>
    </S.Container>
  );
};

export default UploadBase;
