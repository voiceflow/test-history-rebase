import { LinkProps } from 'react-router-dom';

import { Color } from './link.enum';
import { SystemProps } from './link.style';

export interface BaseProps extends SystemProps {
  color?: string | Color;
  active?: boolean;
  disabled?: boolean;
  textDecoration?: boolean;
}

export interface AnchorProps extends BaseProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export interface ButtonProps extends BaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface LinkRouterProps extends BaseProps, LinkProps {}
