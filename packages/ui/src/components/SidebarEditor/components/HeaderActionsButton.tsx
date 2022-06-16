import { Utils } from '@voiceflow/common';
import React from 'react';

import IconButton from '../../IconButton';
import type { OptionsMenuOption } from '../../OptionsMenu';
import Select from '../../Select';
import * as T from '../types';

const HeaderActionsButton: React.FC<T.HeaderActionsButtonProps> = ({ actions, placement = 'bottom-end' }) => (
  <Select<OptionsMenuOption>
    options={actions.filter(Utils.array.isNotNullish)}
    minWidth={false}
    onSelect={(option) => option.onClick?.()}
    placement={placement}
    getOptionKey={(_, index) => String(index)}
    renderTrigger={({ ref, isOpen, onClick }) => (
      <IconButton
        ref={ref as React.RefObject<HTMLButtonElement>}
        icon="ellipsis"
        variant={IconButton.Variant.BASIC}
        onClick={onClick}
        offsetSize={0}
        activeClick={isOpen}
      />
    )}
    getOptionLabel={(option) => option?.label}
  />
);

export default HeaderActionsButton;
