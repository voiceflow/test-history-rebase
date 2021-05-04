import { css, styled } from '@/hocs';

const Container = styled.div<{ error?: boolean }>`
  min-height: 42px;
  width: 100%;
  color: #132042;
  font-size: 15px;
  background: #fff;
  border: 1px solid #d2dae2;
  border-radius: 6px;
  padding: 10px 16px;
  line-height: 20px;

  ${({ error }) =>
    error &&
    css`
      border-color: #e91e63;
    `}
`;

export default Container;
