import { BoxFlex, Input, SvgIcon } from '@voiceflow/ui';
import React from 'react';

export interface ProjectAPIKeyInputProps {
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onCopy: (value: string) => void;
}

const ProjectAPIKeyInput: React.FC<ProjectAPIKeyInputProps> = ({ children, value, show, onToggleShow, onCopy }) => {
  return (
    <BoxFlex mb={12}>
      <Input
        value={value}
        type={show ? 'text' : 'password'}
        readOnly
        rightAction={<SvgIcon icon={show ? 'eye' : 'eyeHide'} onClick={onToggleShow} color="#becedc" clickable style={{ userSelect: 'none' }} />}
        onClick={() => onCopy(value)}
      />
      {children}
    </BoxFlex>
  );
};

export default ProjectAPIKeyInput;
