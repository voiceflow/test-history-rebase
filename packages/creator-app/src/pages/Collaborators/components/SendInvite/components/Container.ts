import { css, styled } from '@/hocs/styled';
import { FadeLeft } from '@/styles/animations';

export interface ContainerProps {
  error: boolean;
  inline?: boolean;
}

const Container = styled.div<ContainerProps>`
  border-bottom: 1px solid #eaeff4;
  padding: 0 32px;
  padding-bottom: ${({ error }) => (error ? 0 : 16)}px;

  ${({ inline }) =>
    inline &&
    css`
      padding-top: 24px;

      ${FadeLeft}
    `}
`;

export default Container;
