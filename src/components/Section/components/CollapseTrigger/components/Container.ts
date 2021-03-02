import { css, styled } from '@/hocs';

const Container = styled.div<{ disabled?: boolean }>`
  & > div {
    ${({ disabled }) =>
      disabled &&
      css`
        cursor: default;
      `}
  }
`;

export default Container;
