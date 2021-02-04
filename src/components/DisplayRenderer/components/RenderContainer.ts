import { styled } from '@/hocs';

export type RenderContainerProps = {
  height: number;
};

const RenderContainer = styled.div<RenderContainerProps>`
  overflow: hidden;
  flex: 1;

  height: ${({ height }) => height}px;
`;

export default RenderContainer;
