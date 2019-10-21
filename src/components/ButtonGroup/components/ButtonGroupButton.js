import BaseButton from '@/componentsV2/Button/components/BaseButton';
import { css, styled, transition } from '@/hocs';

const ButtonGroupButton = styled(BaseButton)`
  flex: 1;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 10px 12px;
  white-space: nowrap;
  color: #62778c;
  background: transparent;
  font-weight: 600;
  ${transition()}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background: #fff;
      box-shadow: 0 1px 3px 0 rgba(14, 30, 37, 0.1);
      color: #132144;
    `}
`;

export default ButtonGroupButton;
