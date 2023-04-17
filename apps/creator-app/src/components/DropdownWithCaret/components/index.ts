import { SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { TextVariant } from '../types';

export const CaretIcon = styled(SvgIcon)`
  display: inline-block;
`;

/**
 *  style guildeline:
 * if a user passes a border
 * 1. caret color should not change when menu opens
 * 2. border color changes to blue when menu opens
 * */
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

  ${({ variant, isOpen, theme }) =>
    variant === TextVariant.secondary &&
    !isOpen &&
    css`
      color: ${theme.colors.secondary};
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


   ${({ border, isOpen, theme }) =>
    border &&
    css`
      border: ${isOpen ? `1px solid ${theme.colors.blue}` : border};
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
  margin-right: 8px;

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
