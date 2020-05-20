import { flexApartStyles } from '@/components/Flex';
import { styled, units } from '@/hocs';

import { HEADER_HEIGHT, HEADER_HEIGHT_WITH_NAME, sectionStyles } from '../../../styles';

export type ContainerProps = {
  withTitle?: boolean;
};

const Container = styled.div.attrs({ column: true })<ContainerProps>`
  ${flexApartStyles}
  ${sectionStyles}

  height: ${({ withTitle }) => (withTitle ? HEADER_HEIGHT_WITH_NAME : HEADER_HEIGHT)}px;
  padding-top: ${units(2.5)}px;
  padding-bottom: ${units(2)}px;
  border-bottom: 1px solid #dfe3ed;
  background-color: #fff;
  z-index: 1;
`;

export default Container;
