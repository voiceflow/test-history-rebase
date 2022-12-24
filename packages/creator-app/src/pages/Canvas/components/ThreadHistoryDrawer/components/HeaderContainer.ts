import { flexApartStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { sectionStyles } from '@/pages/Canvas/components/Editor/styles';

import { HEADER_HEIGHT } from '../constants';

const Container = styled.div<{ borderColor: string }>`
  ${flexApartStyles}
  ${sectionStyles}

  height: ${HEADER_HEIGHT}px;
  border-bottom: solid 1px ${(props) => props.borderColor};
  background-color: #fff;
  z-index: 1;
  cursor: default;
`;

export default Container;
