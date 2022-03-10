import { css, styled, transition } from '@/hocs';

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

  ${({ active }) =>
    active &&
    css`
      border: 1px solid #eef4f6;
      font-weight: 600;
      background: #eef4f6;
      border: solid 1px #dfe3ed;
    `}

  &:hover {
    background: #eef4f6;
    border: 1px solid #eef4f6;
  }

  &:last-child {
    margin-bottom: 16px;
  }
`;
