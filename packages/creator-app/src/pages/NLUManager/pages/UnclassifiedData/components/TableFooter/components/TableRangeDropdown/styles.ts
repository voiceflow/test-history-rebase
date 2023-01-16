import { css, styled } from '@/hocs/styled';

export const SliderContainer = styled.div`
  padding: 8px 24px;
  gap: 24px;
  display: flex;
`;

export const DropdownContainer = styled.div<{ showPagination: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ showPagination }) =>
    showPagination &&
    css`
      gap: 12px;
    `}
`;

export const DropdownButtonContainer = styled.div<{ showPagination: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ showPagination }) =>
    showPagination &&
    css`
      cursor: pointer;
    `}
`;
