import { HeaderIconButton } from '@/components/ProjectPage';
import { styled } from '@/hocs';

const RunButton = styled(HeaderIconButton)`
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

export default RunButton;
