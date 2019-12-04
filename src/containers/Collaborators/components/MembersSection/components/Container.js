import SimpleBar from 'simplebar-react';

import { styled } from '@/hocs';

const Container = styled(SimpleBar)`
  max-height: 370px;
  min-height: 200px;
  padding: 0px;
  overflow: auto;
`;

export default Container;
