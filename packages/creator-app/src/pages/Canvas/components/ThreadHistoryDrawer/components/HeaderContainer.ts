import { flexApartStyles } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { sectionStyles } from '@/pages/Canvas/components/Editor/styles';

import { HEADER_HEIGHT } from '../constants';

const Container = styled.div`
  ${flexApartStyles}
  ${sectionStyles}

  height: ${HEADER_HEIGHT}px;
  border-bottom: solid 1px #eaeff4;
  background-color: #fff;
  z-index: 1;
`;

export default Container;
