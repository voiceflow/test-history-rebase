import { Input, inputStyle } from '@voiceflow/ui';
import React from 'react';

import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';
import PrefixText from '@/components/InputGroupText';
import { styled } from '@/hocs';

const InputGroupText = styled(PrefixText)`
  color: #62778c !important;
  text-transform: uppercase;
  background: none;
  font-size: 13px;
  border-color: #d4d9e6 !important;
  line-height: 22px;
  padding: 6px 16px;
  font-weight: 600;
`;

const InputSection = styled(Input)`
  padding-left: 0px;
  border-color: #d4d9e6 !important;
  ${inputStyle}
  border-left: 0px !important;
  :focus {
    border-left: 0px !important;
  }
`;

const Container = styled(InputGroup)`
  :focus-within {
    ${InputGroupText}, ${InputSection} {
      border-color: #5d9df5 !important;
    }
  }
  div span {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

interface PrefixInputProps {
  prefix?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const PrefixInput: React.FC<PrefixInputProps> = ({ prefix, onChange }) => (
  <Container className="mb-2">
    <InputGroupAddon addonType={AddonType.PREPEND}>
      <InputGroupText>{prefix}</InputGroupText>
    </InputGroupAddon>
    <InputSection className="form-control form-control-border right" placeholder="Enter value" onChange={onChange} />
  </Container>
);

export default PrefixInput;
