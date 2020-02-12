import * as SvgIcon from '@/components/SvgIcon';
import { css, styled, transition } from '@/hocs';

const BillingDropdown = styled.div`
  ${transition()}
  cursor: pointer;
  font-size: 13px;
  color: #62778c;

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
