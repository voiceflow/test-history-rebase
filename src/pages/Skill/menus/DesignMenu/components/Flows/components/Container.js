import { styled } from '@/hocs';
import { FadeLeft } from '@/styles/animations';

import ScrollbarsContainer from '../../ScrollbarsContainer';

const Container = styled(ScrollbarsContainer)`
  flex-direction: column;

  ${FadeLeft};
`;

export default Container;
