import SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

import { TextVariant } from '../types';

export const CaretIcon = styled(SvgIcon)`
  display: inline-block;
`;

export const ButtonContainer = styled.div<{
  isOpen: boolean;
  padding?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  border?: string;
  variant: TextVariant;
}>`
  cursor: pointer;
  display: inline-block;

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

   ${({ border }) =>
    border &&
    css`
      border: ${border};
      border-radius: 5px;
      padding: 12px 16px;
    `}

    ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}

    ${({ fullWidth }) =>
    fullWidth &&
    css`
      display: flex;
      align-items: center;
    `}
`;

export const TextContainer = styled.div<{ capitalized?: boolean; fullWidth?: boolean }>`
  display: inline-block;
  margin-right: 10px;

  color: ${({ color = '#6e849a' }) => color};
  ${({ capitalized }) =>
    capitalized &&
    css`
      text-transform: uppercase;
    `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      flex: 1;
    `}
`;

export const DisabledWrapper = styled.span<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`;
