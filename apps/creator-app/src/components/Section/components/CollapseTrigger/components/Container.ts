import { css, styled } from '@/hocs/styled';

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
