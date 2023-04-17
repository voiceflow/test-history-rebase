import { Button, PrimaryButton, PrimaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface IconedButtonProps extends PrimaryButtonProps {
  isOpen: boolean;
}

const IconedButton = styled(Button)<IconedButtonProps>`
  cursor: pointer;
  border-top-left-radius: 2px !important;
  border-bottom-left-radius: 2px !important;
  width: 42px;
  display: flex;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? '#2f75d6' : '#3d82e2')};

  ${PrimaryButton.Icon} {
    background: none;
    margin-right: 1px;
    margin-top: 1px;
  }

  ${PrimaryButton.Label} {
    padding: 0;
  }
`;

export default IconedButton;
