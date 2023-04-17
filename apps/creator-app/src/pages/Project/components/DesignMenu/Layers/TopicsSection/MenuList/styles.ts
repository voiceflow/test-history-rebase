import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  isSubtopic?: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;

  ${({ isSubtopic }) =>
    isSubtopic
      ? css`
          margin-left: 26px;
        `
      : css`
          margin-left: 38px;
          margin-right: 12px;
        `}
`;
