import BlockCard from '@/containers/CanvasV2/components/BlockCard';
import { css, styled } from '@/hocs';

import BlockOverlay from './BlockOverlay';

const BlockContainer = styled(BlockCard)`
  max-width: 240px;
  border-width: 6px 0 0 0;
  border-style: solid;
  border-color: ${({ color }) => color};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: ${({ theme }) => theme.color.gradient[0]};
  cursor: pointer;

  ${({ isEnabled }) =>
    !isEnabled &&
    css`
      opacity: 0.5;
    `};

  & ${BlockOverlay} {
    border-color: ${({ color }) => color};
    border-width: ${({ isActive }) => (isActive ? 1 : 0)}px;
  }

  .avatar {
    position: absolute;
    top: -20px;
    left: -15px;
    z-index: 99;
  }
`;

export default BlockContainer;
