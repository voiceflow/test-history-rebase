import { Utils } from '@voiceflow/common';
import { Button, OptionsMenuOption, PopperProps, Select, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

interface FooterActionsButtonProps {
  actions: Array<OptionsMenuOption | UIOnlyMenuItemOption | null>;
  placement?: PopperProps['placement'];
}

const FooterActionsButton: React.FC<FooterActionsButtonProps> = ({ actions, placement = 'bottom' }) => (
  <Select<OptionsMenuOption>
    options={actions.filter(Utils.array.isNotNullish)}
    minWidth={false}
    onSelect={(option) => option.onClick?.()}
    placement={placement}
    modifiers={{ offset: { enabled: true, offset: '0,4' }, preventOverflow: { enabled: true, boundariesElement: document.body, padding: 16 } }}
    getOptionKey={(_, index) => String(index)}
    isMultiLevel
    renderTrigger={({ ref, isOpen, onClick }) => (
      <Button
        ref={ref as React.RefObject<HTMLButtonElement>}
        flat
        icon="toggles"
        variant={Button.Variant.SECONDARY}
        onClick={onClick}
        isActive={isOpen}
        squareRadius
      />
    )}
    selectedOptions={[]}
    renderOptionsFilter={() => true}
    getOptionLabel={(option) => option?.label}
  />
);

export default FooterActionsButton;
