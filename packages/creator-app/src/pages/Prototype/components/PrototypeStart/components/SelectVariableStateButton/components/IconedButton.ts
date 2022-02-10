import { Button, PrimaryButtonIcon, PrimaryButtonLabel, PrimaryButtonProps } from '@voiceflow/ui';

import { styled } from '@/hocs';

interface IconedButtonProps extends PrimaryButtonProps {
  isOpen: boolean;
}

const IconedButton = styled(Button)<IconedButtonProps>`
  cursor: pointer;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  width: 42px;
  display: flex;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? '#2f75d6' : '#3d82e2')};

  ${PrimaryButtonIcon} {
    background: none;
  }

  ${PrimaryButtonLabel} {
    padding: 0;
  }
`;

export default IconedButton;
