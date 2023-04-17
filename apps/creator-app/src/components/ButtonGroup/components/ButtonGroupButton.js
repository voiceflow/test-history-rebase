import { BaseButton } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const ButtonGroupButton = styled(BaseButton)`
  flex: 1;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 8px 18px;
  white-space: nowrap;
  color: #62778c;
  background: transparent;
  font-weight: 600;
  ${transition()}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background: #fff;
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 2px 5px 0 rgba(17, 49, 96, 0.16);
      color: #132144;
    `}
`;

export default ButtonGroupButton;
