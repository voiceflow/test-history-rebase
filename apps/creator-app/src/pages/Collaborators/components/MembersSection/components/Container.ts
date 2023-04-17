import SimpleBar from 'simplebar-react';

import { styled } from '@/hocs/styled';

const Container = styled(SimpleBar)`
  max-height: 370px;
  min-height: 200px;
  padding-left: 32px;
  overflow-x: hidden;
  overflow-x: clip;
  overflow-y: auto;
`;

export default Container;
