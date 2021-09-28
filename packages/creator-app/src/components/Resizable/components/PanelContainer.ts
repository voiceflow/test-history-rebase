import { styled } from '@/hocs';

export interface PanelContainerProps {
  height?: number;
  minHeight: number;
}

const PanelContainer = styled.div<PanelContainerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: ${({ height }) => height ?? 0}%;
  min-height: ${({ minHeight }) => minHeight}px;
`;

export default PanelContainer;
