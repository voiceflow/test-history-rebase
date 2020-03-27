import { css, styled } from '@/hocs';
import { ACTIVE_NODES_CANVAS_CLASSNAME } from '@/pages/Canvas/constants';

const LinkGroup = styled.g`
  .${ACTIVE_NODES_CANVAS_CLASSNAME} & {
    ${({ isActive }) =>
      !isActive &&
      css`
        opacity: 0.7;
      `}
  }
`;

export default LinkGroup;
