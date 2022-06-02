import { blurryTranscripts } from '@/assets';
import { styled } from '@/hocs';

const TranscriptsBackgroundContainer = styled.div`
  background-image: url('${blurryTranscripts}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: blur(8px);
  -webkit-filter: blur(8px);
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
`;

export default TranscriptsBackgroundContainer;
