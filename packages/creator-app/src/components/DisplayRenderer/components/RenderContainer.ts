import { styled } from '@/hocs/styled';

export interface RenderContainerProps {
  height: number;
}

const RenderContainer = styled.div<RenderContainerProps>`
  overflow: hidden;
  flex: 1;

  height: ${({ height }) => height}px;
`;

export default RenderContainer;
