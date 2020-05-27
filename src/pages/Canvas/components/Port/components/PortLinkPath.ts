import { css, styled } from '@/hocs';
import { HIGHLIGHT_COLOR, Path } from '@/pages/Canvas/components/Link';

export type PortLinkPathProps = {
  isHighlighted: boolean;
};

const PortLinkPath = styled(Path)<PortLinkPathProps>`
  stroke-width: 1.5px;
  transform: translateY(-2px);

  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      stroke: ${HIGHLIGHT_COLOR};
    `}
`;

export default PortLinkPath;
