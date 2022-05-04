import { styled, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

export interface ContentProps extends SpaceProps {
  topOffset?: boolean;
}

const Content = styled.div<ContentProps>`
  padding: ${({ theme, topOffset }) => (topOffset ? theme.unit * 0.5 : 0)}px ${units(4)}px ${units()}px ${units(4)}px;
  ${space}
`;

export default Content;
