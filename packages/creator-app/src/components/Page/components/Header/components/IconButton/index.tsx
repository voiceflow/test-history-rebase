import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';
import * as T from './types';

export * as IconButtonTypes from './types';

const IconButton: React.ForwardRefRenderFunction<HTMLDivElement, T.Props> = (
  { size, tooltip, isSmall, className, expandable, expandActive, expandTooltip, onExpandClick, ...props },
  ref
) => {
  const button = <S.Button size={size ?? (isSmall ? 16 : 20)} isSmall={isSmall} {...props} />;

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
};

export default Object.assign(React.forwardRef<HTMLDivElement, T.Props>(IconButton), { S });
