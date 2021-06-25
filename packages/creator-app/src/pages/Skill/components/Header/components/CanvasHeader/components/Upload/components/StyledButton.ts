import { HeaderIconButton } from '@/components/ProjectPage';
import { Button } from '@/components/ProjectPage/components/Header/components/IconButton/components';
import { styled } from '@/hocs';

const Popup = styled(HeaderIconButton)`
  ${Button} {
    background-color: #fdfdfd;

    &:hover {
      background-color: #fbfbfb;
    }
  }
`;

export default Popup;
