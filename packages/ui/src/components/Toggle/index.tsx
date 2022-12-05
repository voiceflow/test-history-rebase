import { Box } from '@ui/components/Box';
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
    <S.ToggleOuterContainer hasLabel={hasLabel}>
      {hasLabel && (
        <Box mr={12} width="26px">
          {checked ? 'On' : 'Off'}
        </Box>
      )}

      <S.ToggleContainer size={size}>
        <ReactToggle
          {...props}
          checked={checked}
          ref={ref as React.LegacyRef<ReactToggle>}
          onChange={onChange}
          onClick={stopPropagation()}
          icons={false}
        />
      </S.ToggleContainer>
    </S.ToggleOuterContainer>
  )
);

export default Object.assign(Toggle, { Size });
