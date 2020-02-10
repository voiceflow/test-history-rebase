import { styled } from '@/hocs';

const ProgressBar = styled.div`
  width: ${({ percent }) => (percent ? `${percent}%` : 0)};
  background-color: #f6f9fa;
  position: absolute;
  left: 0;
  z-index: 0;
  height: 100%;
`;

export default ProgressBar;
