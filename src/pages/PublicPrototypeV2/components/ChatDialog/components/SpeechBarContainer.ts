import { styled } from '@/hocs';
import PrototypeSpeechBarContainer from '@/pages/Prototype/components/PrototypeSpeechBar/components/Container';

const SpeechBarContainer = styled.div`
  margin: -16px 0 -16px -24px;
  flex: 1;

  ${PrototypeSpeechBarContainer} {
    padding: 16px 0 16px 24px;
  }
`;

export default SpeechBarContainer;
