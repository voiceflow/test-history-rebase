import { useEnableDisable } from '@ui/hooks';
import React from 'react';

import { Label } from './components';
import * as S from './styles';
import type * as T from './types';

export * as ActionTypes from './types';

const Action = React.forwardRef<HTMLDivElement, T.Props>(
  ({ icon, port, label, active, onClick, nodeID, reversed, onDoubleClick }, ref) => {
    const [contentHovered, onContentMouseEnter, onContentMouseLeave] = useEnableDisable(false);

    return (
      <S.Container ref={ref} borders={active || contentHovered} reversed={reversed} data-node-id={nodeID}>
        <S.Content
          active={active || contentHovered}
          onClick={onClick}
          onMouseEnter={onClick && onContentMouseEnter}
          onMouseLeave={onClick && onContentMouseLeave}
          onDoubleClick={onDoubleClick}
        >
          {icon}

          {label}
        </S.Content>

        {port}
      </S.Container>
    );
  }
);

export default Object.assign(Action, {
  S,
  Port: S.Port,
  Icon: S.Icon,
  Label,
  Separator: S.Separator,
  Connector: S.Connector,
});
