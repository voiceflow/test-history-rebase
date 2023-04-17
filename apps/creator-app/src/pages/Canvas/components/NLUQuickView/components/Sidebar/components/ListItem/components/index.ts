import { css, styled, transition } from '@/hocs/styled';

export const Container = styled.div<{ active?: boolean }>`
  ${transition(' border', 'background')}
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 2px;

  &:hover {
    background: #eef4f6;
    border: 1px solid #eef4f6;
  }

  &:last-child {
    margin-bottom: 16px;
  }

  ${({ active }) =>
    active &&
    css`
      font-weight: 600;
      background: #eef4f6;
      border: 1px solid #dfe3ed !important;
    `}
`;
