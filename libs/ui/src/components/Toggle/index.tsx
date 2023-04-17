import { stopPropagation } from '@ui/utils/dom';
import { Utils } from '@voiceflow/common';
import React from 'react';
import ReactToggle from 'react-toggle';

import { Size } from './constants';
import * as S from './styles';

interface ToggleProps {
  size?: Size;
  name?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  hasLabel?: boolean;
}

const Toggle = React.forwardRef<HTMLDivElement | ReactToggle, ToggleProps>(
  ({ size = Size.NORMAL, hasLabel = false, checked, onChange = Utils.functional.noop, ...props }, ref) => (
    <S.Container hasLabel={hasLabel}>
      {hasLabel && <S.Label>{checked ? 'On' : 'Off'}</S.Label>}

      <S.Content size={size}>
        <ReactToggle
          {...props}
          ref={ref as React.LegacyRef<ReactToggle>}
          icons={false}
          checked={checked}
          onChange={onChange}
          onClick={stopPropagation()}
        />
      </S.Content>
    </S.Container>
  )
);

export default Object.assign(Toggle, { Size });
