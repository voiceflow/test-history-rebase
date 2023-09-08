import { listResetStyle } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Container = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 -7px -7px;
  padding: 0 5px 5px;
  list-style-type: none;

  ${listResetStyle}
`;

export default Container;
