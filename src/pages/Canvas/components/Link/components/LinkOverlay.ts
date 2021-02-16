import { styled } from '@/hocs';

const LinkOverlay = styled.path`
  stroke: transparent;
  stroke-width: 15px;
  fill: transparent;
  pointer-events: auto;

  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

export default LinkOverlay;
