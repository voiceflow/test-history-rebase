import { SvgIconContainer } from '@/components/SvgIcon';
import { inputStyle } from '@/componentsV2/Input/styles';
import { css, styled } from '@/hocs';

import { OrientationType } from '../constants';

const DropdownButton = styled.button`
  ${inputStyle}

  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  height: auto;
  box-shadow: none;

  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: ease all 0.15s;

  ${({ orientation }) =>
    orientation === OrientationType.RIGHT
      ? css`
          padding-left: 12px;
          padding-right: 2px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: 0;
        `
      : css`
          padding-left: 2px;
          padding-right: 12px;
          border-left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        `}
  ${SvgIconContainer} {
    margin-left: 5px;
    margin-top: 2px;
  }

  ${({ active }) =>
    active &&
    css`
      color: #5d9df5;
    `}

  :active,
  :focus,
  :focus-within {
    ${({ orientation }) => (orientation === OrientationType.RIGHT ? 'border-right' : 'border-left')}: 0 !important;
    box-shadow: none !important;
    border-color: #d2dae2 !important;
  }
  :hover {
    color: #5d9df5 !important;
  }
  ::after {
    margin-left: 0.5rem;
  }
`;

export default DropdownButton;
