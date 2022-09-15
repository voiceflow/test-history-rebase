import { css, styled } from '@/hocs';

interface ContainerProps {
  isCreatingMarkupText: boolean;
}

const Container = styled.section<ContainerProps>`
  flex-direction: column;
  position: relative;
  overflow: hidden;
  overflow: clip;
  display: flex;
  height: 100%;
  width: 100vw;

  ${({ isCreatingMarkupText }) =>
    isCreatingMarkupText &&
    css`
      cursor: text;
    `}
`;

export default Container;
