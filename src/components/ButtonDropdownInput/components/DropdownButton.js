import { SvgIconContainer } from '@/components/SvgIcon';
import { inputStyle } from '@/componentsV2/Input';
import { css, styled } from '@/hocs';

const DropdownButton = styled.button`
  ${inputStyle}

  padding-left: 12px;
  padding-right: 2px;
  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  border-right: 0;
  height: auto;

  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: grey !important;

  ${SvgIconContainer} {
    margin-left: 5px;
  }

  ${({ active }) =>
    active &&
    css`
      color: #5d9df5;
    `}

  :active,
  :focus,
  :focus-within {
    border-right: 0 !important;
  }
  :hover {
    color: #5d9df5 !important;
  }
  ::after {
    margin-left: 0.5rem;
  }
`;

export default DropdownButton;
