import { css, styled, transition } from '@/styles';

export const SortContainer = styled.div<{ visible?: boolean }>`
  ${transition('opacity')}

  position: relative;
  width: 20px;
  margin-left: 6px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const Container = styled.div<{ flex: number; width?: number; active?: boolean; sortable?: boolean }>`
  display: inline-flex;
  align-items: center;
  flex: ${({ flex }) => flex};

  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  font-weight: 600;
  text-align: left;

  &:hover ${SortContainer} {
    opacity: 1;
  }

  ${({ active }) =>
    active &&
    css`
      color: #132144;
    `}

  ${({ sortable }) =>
    sortable &&
    css`
      cursor: pointer;
    `}

    ${({ width }) =>
    width &&
    css`
      width: ${width}px;
      min-width: ${width}px;
      max-width: ${width}px;
    `}
`;
