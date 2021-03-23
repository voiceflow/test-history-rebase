import { styled } from '@/hocs';

const LinkOverlay = styled.path`
  fill: none;
  stroke: white;
  stroke-width: 13.15px;
  pointer-events: stroke;
  visibility: hidden;

  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

export default LinkOverlay;
