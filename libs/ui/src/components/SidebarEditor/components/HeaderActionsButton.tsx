import * as System from '@ui/system';
import { Utils } from '@voiceflow/common';
import React from 'react';

import type { OptionsMenuOption } from '../../OptionsMenu';
import Select from '../../Select';
import * as T from '../types';

const HeaderActionsButton: React.FC<T.HeaderActionsButtonProps> = ({ actions, placement = 'bottom-end' }) => {
  const options = actions.filter(Utils.array.isNotNullish);

  if (!options.length) return null;

  return (
    <Select<OptionsMenuOption>
      options={options}
      minWidth={false}
      onSelect={(option) => option.onClick?.()}
      placement={placement}
      getOptionKey={(_, index) => String(index)}
      renderTrigger={({ ref, isOpen, onClick }) => (
        <System.IconButton.Base ref={ref as React.RefObject<HTMLButtonElement>} icon="systemMore" active={isOpen} onClick={onClick} />
      )}
      getOptionLabel={(option) => option?.label}
    />
  );
};

export default HeaderActionsButton;
