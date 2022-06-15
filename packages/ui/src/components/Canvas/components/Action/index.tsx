import { useEnableDisable } from '@ui/hooks';
import React from 'react';

import * as S from './styles';
import * as T from './types';
import { trimLabel } from './utils';

export * as ActionTypes from './types';

const Action = React.forwardRef<HTMLDivElement, T.Props>(({ icon, port, label, active, onClick, nodeID, reversed }, ref) => {
  const [contentHovered, onContentMouseEnter, onContentMouseLeave] = useEnableDisable(false);

  return (
    <S.Container ref={ref} borders={active || contentHovered} reversed={reversed} data-node-id={nodeID}>
      <S.Content
        active={active || contentHovered}
        onClick={onClick}
        onMouseEnter={onClick && onContentMouseEnter}
        onMouseLeave={onClick && onContentMouseLeave}
      >
        {icon}

        {label}
      </S.Content>

      {port}
    </S.Container>
  );
});

export default Object.assign(Action, {
  trimLabel,

  S,
  Port: S.Port,
  Icon: S.Icon,
  Label: S.Label,
  Separator: S.Separator,
  Connector: S.Connector,
});
