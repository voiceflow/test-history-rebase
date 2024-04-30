import { styled, units } from '@/styles';

import { flexApartStyles } from '../../Flex';
import { HEADER_HEIGHT } from '../constants';

const Header = styled.header`
  ${flexApartStyles}
  height: ${HEADER_HEIGHT}px;
  padding: ${units()}px ${units(4)}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
`;

export default Header;
