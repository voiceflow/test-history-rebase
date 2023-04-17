import { flexApartStyles } from '@voiceflow/ui';

import { styled, units } from '@/hocs/styled';

import { HEADER_HEIGHT, sectionStyles } from '../../../styles';

const Container = styled.div`
  ${flexApartStyles}
  ${sectionStyles}

  border-bottom: 1px solid #dfe3ed;
  height: ${HEADER_HEIGHT}px;
  padding-top: ${units(2.5)}px;
  padding-bottom: ${units(2)}px;
  background-color: #fff;
  z-index: 1;
`;

export default Container;
