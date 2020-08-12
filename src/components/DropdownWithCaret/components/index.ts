import SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

import { TextVariant } from '../types';

export const CaretIcon = styled(SvgIcon)`
  display: inline-block;
`;

export const ButtonContainer = styled.div<{ isOpen: boolean; padding?: string; disabled?: boolean; variant: TextVariant }>`
  cursor: pointer;
${({ variant, isOpen }) =>
  variant === TextVariant.secondary &&
  !isOpen &&
  css`
    color: #62778c;
  `}

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5190e6;
    `}

   ${({ padding }) =>
     padding &&
     css`
       padding: ${padding};
     `}

    ${({ disabled }) =>
      disabled &&
      css`
        pointer-events: none;
      `}


`;

export const TextContainer = styled.div<{ capitalized?: boolean }>`
  display: inline-block;
  margin-right: 10px;

  color: ${({ color = '#6e849a' }) => color};
  ${({ capitalized }) =>
    capitalized &&
    css`
      text-transform: uppercase;
    `}
`;

export const DisabledWrapper = styled.span<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`;
