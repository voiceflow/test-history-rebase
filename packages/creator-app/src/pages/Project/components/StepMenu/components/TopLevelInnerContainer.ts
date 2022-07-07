import { css, styled } from '@/hocs';

const TopLevelInnerContainer = styled.div<{ size: number }>`
  padding: 4px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 3px 1px rgba(19, 33, 68, 0.01), 0 5px 8px -8px rgba(19, 33, 68, 0.12), 0 2px 4px -3px rgba(19, 33, 68, 0.12),
    0 0 0 1px rgba(19, 33, 68, 0.03);
  overflow: hidden;
  transition: height 0.15s ease;

  ${({ size }) => css`
    height: ${size * 64 + 8}px;
  `}
`;

export default TopLevelInnerContainer;
