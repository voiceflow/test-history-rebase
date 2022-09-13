import { css, styled } from '@/hocs';

interface ContainerProps {
  isCreatingMarkupText: boolean;
}

const Container = styled.section<ContainerProps>`
  position: relative;
  display: flex;
  width: 100vw;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  overflow: clip;

  ${({ isCreatingMarkupText }) =>
    isCreatingMarkupText &&
    css`
      cursor: text !important;

      a,
      button {
        cursor: text !important;
      }
    `}
`;

export default Container;
