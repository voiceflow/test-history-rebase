import { Tabs, toast } from '@voiceflow/ui';
import React from 'react';

import { UPLOAD_ERROR } from '../../constants';
import { UploadFileType } from '../../Context';
import { RootDropAreaProps, ValueRendererProps } from '../../types';
import { SingleUploadConfig, useUpload } from '../../useUpload';
import { hasVariables } from '../../utils';
import Drop from '../Drop/index';
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

export interface UploadBaseProps {
  validateLink?: (value: string) => string | null | Promise<null>;
  renderValue: (props: ValueRendererProps) => JSX.Element;
  onChange: (value: string | null) => void;
  renderInput?: InputRenderer;

  rootDropAreaProps?: RootDropAreaProps;
  linkInputPlaceholder?: string;
  acceptedFileTypes?: string[];
  fileType: UploadFileType;
  onlyUpload?: boolean;
  value: string | null;
  endpoint: string;
  label: string;
}

const UploadBase: React.FC<UploadBaseProps & SingleUploadConfig> = ({
  acceptedFileTypes = [],
  linkInputPlaceholder,
  rootDropAreaProps,
  onlyUpload = false,
  validateLink,
  renderValue,
  renderInput,
  fileType,
  endpoint,
  onChange,
  validate,
  label,
  value,
}) => {
  const onError = React.useCallback(
    (message: string) => {
      let finalMessage = message;

      if (message === UPLOAD_ERROR.INVALID_FILE_TYPE) {
        finalMessage = `File type not support. ${acceptedFileTypes.join(', ')} file types are supported`;
      }

      toast.custom({ method: 'error', icon: 'warning', color: '#bd425f', content: finalMessage });
    },
    [acceptedFileTypes]
  );

  const valueHasVariable = value ? hasVariables(value) : false;
  const hasDisplayableValue = !!value && !valueHasVariable;
  const [activeTab, setActiveTab] = React.useState(valueHasVariable ? TabType.LINK : TabType.UPLOAD);
  const { onDropAccepted, onDropRejected, isLoading, error, setError } = useUpload({
    fileType,
    endpoint,
    validate,
    update: onChange,
    onError,
  });

  const shouldDisplayDropArea = activeTab === TabType.UPLOAD || hasDisplayableValue;

  return (
    <S.Container>
      {!onlyUpload && (
        <Tabs value={activeTab} onChange={setActiveTab}>
          {tabs.map(({ label, type }) => (
            <Tabs.Tab key={type} value={type}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs>
      )}

      {activeTab === TabType.LINK && !onlyUpload && (
        <LinkInput
          value={value}
          renderInput={renderInput}
          placeholder={linkInputPlaceholder!}
          onChangeText={onChange}
          validate={validateLink}
        />
      )}

      {shouldDisplayDropArea && (
        <Drop
          hasDisplayableValue={hasDisplayableValue}
          rootDropAreaProps={rootDropAreaProps}
          acceptedFileTypes={acceptedFileTypes}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          renderValue={renderValue}
          isLoading={isLoading}
          setError={setError}
          value={value!}
          label={label}
          error={error}
        />
      )}
    </S.Container>
  );
};

export default UploadBase;
