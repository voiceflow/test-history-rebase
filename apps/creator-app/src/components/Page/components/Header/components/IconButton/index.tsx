import { SvgIcon, System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';
import type * as T from './types';

export * as IconButtonTypes from './types';

const IconButton = React.forwardRef<HTMLDivElement, T.Props>(
  (
    {
      size = System.IconButton.Size.L,
      tooltip,
      className,
      expandable,
      expandActive,
      expandTooltip,
      onExpandClick,
      hoverBackground = false,
      ...props
    },
    ref
  ) => {
    const button = <S.Button size={size} hoverBackground={hoverBackground} {...props} />;

    return (
      <S.Container ref={ref} className={className}>
        {tooltip ? <TippyTooltip {...tooltip}>{button}</TippyTooltip> : button}

        {expandable && (
          <TippyTooltip disabled={!expandTooltip} {...expandTooltip}>
            <S.ExpandIconContainer onClick={onExpandClick} isActive={expandActive}>
              <SvgIcon icon="expand" size={7} color="#6e849a" />
            </S.ExpandIconContainer>
          </TippyTooltip>
        )}
      </S.Container>
    );
  }
);

export default Object.assign(IconButton, { S });
