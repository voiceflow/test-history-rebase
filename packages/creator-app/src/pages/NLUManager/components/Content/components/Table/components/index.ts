import { Box, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const OrderBox = styled(Box)<{ show: boolean }>`
  ${transition('opacity')}
  opacity: 0;
  ${({ show }) =>
    show &&
    css`
      opacity: 1;
    `}
`;
export const Header = styled.div<{ hasScrolled: boolean }>`
  ${transition('border-bottom')};
  display: flex;
  gap: 16px;

  padding: 12px 32px;
  flex-direction: row;
  width: 100%;
  border-bottom: solid 1px #dfe3ed;
  align-items: center;
  background: #fdfdfd;
  position: sticky;
  top: 0px;
  z-index: 2;
  ${({ hasScrolled }) =>
    hasScrolled &&
    css`
      border-bottom: solid 1px #dfe3ed;
    `}
`;

export const ItemsContainer = styled(Box)`
  background-color: white;
`;

export const HeaderItem = styled.div<{ flex: number; isActive: boolean; hasSorter: boolean }>`
  color: ${({ theme }) => theme.colors[ThemeColor.SECONDARY]};
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  display: inline-flex;
  align-items: center;

  &:hover ${OrderBox} {
    opacity: 1;
  }

  ${({ isActive, hasSorter }) =>
    isActive &&
    hasSorter &&
    css`
      color: #132144;
    `}

  & > span {
    cursor: default;
  }

  ${({ hasSorter }) =>
    hasSorter &&
    css`
      cursor: pointer;
    `}

  ${({ flex }) => css`
    flex: ${flex};
  `}
`;
