import { Flex, SvgIcon } from '@voiceflow/ui';
import AutosizeInput from 'react-input-autosize';

import { css, styled, transition } from '@/hocs/styled';

export const SearchContainer = styled(Flex)`
  input {
    border: none !important;
    background: transparent;
    box-shadow: none;
    padding-right: 0px;
    padding-left: 0px;
  }
`;

interface MenuInputProps {
  $fullWidth?: boolean;
}

export const MenuInput = styled(AutosizeInput)<MenuInputProps>`
  padding: 12px 0;
  line-height: 20px;
  flex: 100;

  input {
    border: none;
    background: transparent;
    padding-right: 0px;
    padding-left: 0px;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      input {
        width: 100% !important;
      }
    `}

  ::placeholder {
    line-height: 20px;
  }
`;

interface StyledSvgIconProps {
  isInputEmpty: boolean;
}

export const StyledSvgIcon = styled(SvgIcon)<StyledSvgIconProps>`
  ${({ isInputEmpty }) =>
    !isInputEmpty &&
    css`
      cursor: pointer;
    `}
`;

export const StyledSvgIconContainer = styled.div`
  opacity: 0.85;

  :hover {
    opacity: 1;
  }

  :active {
    opacity: 1;
  }

  ${transition('opacity')};
`;
