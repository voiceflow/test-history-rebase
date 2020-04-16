import { css, styled } from '@/hocs';

export type LinkPathProps = {
  isHovering?: boolean;
  strokeColor?: string;
};

const LinkPath = styled.path<LinkPathProps>`
  stroke: rgb(141, 162, 181);
  stroke-width: 1.5px;
  fill: transparent;

  ${({ strokeColor }) =>
    strokeColor &&
    css`
      stroke: ${strokeColor};
    `}
`;

export default LinkPath;
