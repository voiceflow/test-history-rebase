import { css, styled } from '@/hocs/styled';

export const ProgressLine = styled.div<{ active?: boolean }>`
  width: 24px;
  display: inline-block;
  margin: 0 1px;
  height: 2px;
  background: #dfe3ed;
  ${({ active }) =>
    active &&
    css`
      background: #3d82e2;
    `}
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #8c94a6;
  text-transform: uppercase;
`;

export const Container = styled.div`
  flex: 3;
  text-align: center;
  min-height: 45px;
`;
