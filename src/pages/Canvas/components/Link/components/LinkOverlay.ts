import { styled } from '@/hocs';

const LinkOverlay = styled.path`
  stroke: transparent;
  stroke-width: 15px;
  fill: transparent;
  pointer-events: auto;
  transition: ease 0.15s all;

  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

export default LinkOverlay;
