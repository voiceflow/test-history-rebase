import { Utils } from '@voiceflow/common';
import React from 'react';

import Button from '../../Button';
import type { OptionsMenuOption } from '../../OptionsMenu';
import Select from '../../Select';
import * as T from '../types';

const FooterActionsButton: React.FC<T.FooterActionsButtonProps> = ({ actions, placement = 'bottom' }) => (
  <Select<OptionsMenuOption>
    options={actions.filter(Utils.array.isNotNullish)}
    minWidth={false}
    onSelect={(option) => option.onClick?.()}
    placement={placement}
    modifiers={{
      offset: { enabled: true, offset: '0,2' },
      preventOverflow: { enabled: true, boundariesElement: document.body, padding: 16 },
    }}
    getOptionKey={(_, index) => String(index)}
    isMultiLevel
    renderTrigger={({ ref, isOpen, onClick }) => (
      <Button
        ref={ref as React.RefObject<HTMLButtonElement>}
        flat
        icon="filter"
        variant={Button.Variant.SECONDARY}
        onClick={onClick}
        isActive={isOpen}
        squareRadius
      />
    )}
    getOptionLabel={(option) => option?.label}
    selectedOptions={[]}
    renderOptionsFilter={() => true}
  />
);

export default FooterActionsButton;
