import { blurryTranscripts } from '@/assets';
import { styled } from '@/hocs/styled';

const TranscriptsBackgroundContainer = styled.div`
  background: rgba(249, 249, 249, 0.75) url('${blurryTranscripts}') center no-repeat;
  background-size: contain;
  filter: blur(32px);
  -webkit-filter: blur(32px);
  width: 100%;
  height: 100%;
  position: fixed;
  margin: 0 0 0 65px;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
`;

export default TranscriptsBackgroundContainer;
