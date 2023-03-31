import { SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const BillingDropdown = styled.div<{ disabled?: boolean; error?: boolean; isOpen: boolean }>`
  ${transition()};
  cursor: pointer;
  font-size: 15px;
  color: #62778c;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}

  ${({ error }) =>
    error &&
    css`
      color: #e91e63 !important;
    `}

   ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5;
    `}

  ${SvgIcon.Container} {
    display: inline-block;
    margin-left: 5px;
  }
`;

export default BillingDropdown;
