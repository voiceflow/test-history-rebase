import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { preventDefault } from '@/utils/dom';

import { CursorContainer } from './components/CursorContainer';
import { CursorNametag } from './components/CursorNametag';

export * as CursorConstants from './constants';

export interface CursorProps {
  name: string;
  color: string;
  style?: React.CSSProperties;
  /** @deprecated this is assigned by ref in V2 */
  withTransition?: boolean;
}

const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(({ name, color, style, withTransition = true }, ref) => (
  <CursorContainer withTransition={withTransition} style={style} ref={ref} onClick={preventDefault()}>
    <SvgIcon icon="cursor" color={color} size={24} />
    <CursorNametag color={color}>{name}</CursorNametag>
  </CursorContainer>
));

export default Cursor;
