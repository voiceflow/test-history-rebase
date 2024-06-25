import { styled, units } from '@ui/styles';
import type { LayoutProps, SpaceProps } from 'styled-system';
import { space } from 'styled-system';

export interface ContentProps extends SpaceProps, LayoutProps {
  topOffset?: boolean | number;
  bottomOffset?: boolean | number;
}

const Content = styled.div<ContentProps>`
  padding-top: ${({ theme, topOffset = false }) => units(topOffset === true ? 0.5 : topOffset || 0)({ theme })}px;
  padding-bottom: ${({ theme, bottomOffset = true }) =>
    units(bottomOffset === true ? 1 : bottomOffset || 0)({ theme })}px;
  padding-left: ${units(4)}px;
  padding-right: ${units(4)}px;
  ${space}
`;

export default Content;
