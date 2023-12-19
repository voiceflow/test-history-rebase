import { Utils } from '@voiceflow/common';
import { Button, Menu, Popper } from '@voiceflow/ui-next';
import React from 'react';

import { useDebouncedCallback } from '@/hooks/callback.hook';
import { stopPropagation } from '@/utils/handler.util';

import type { AIGenerateBaseButtonOption, IAIGenerateBaseButton } from './AIGenerateBaseButton.interface';

export const AIGenerateBaseButton = <Option extends AIGenerateBaseButtonOption = AIGenerateBaseButtonOption>({
  options,
  onClick,
  disabled,
  children = 'Generate',
  fullWidth = true,
  isLoading,
  hoverOpen,
}: IAIGenerateBaseButton<Option>): React.ReactElement => {
  const onDebouncedMouseEnter = useDebouncedCallback(150, (toggle: VoidFunction) => toggle());

  return (
    <Popper
      inline
      referenceElement={({ ref, popper, isOpen, onOpen, onClose }) => (
        <Button
          ref={ref}
          name="aiGenerate"
          label={children}
          onClick={hoverOpen ? onClick : Utils.functional.chain(onClick, onOpen)}
          variant="primary"
          iconName="Generate"
          disabled={isLoading || disabled}
          isLoading={isLoading}
          fullWidth={fullWidth}
          isHovering={isOpen}
          onMouseLeave={Utils.functional.chain(hoverOpen && isOpen ? onClose : null, onDebouncedMouseEnter.cancel)}
          onMouseEnter={() => hoverOpen && !isOpen && onDebouncedMouseEnter(onOpen)}
        >
          {popper}
        </Button>
      )}
    >
      {({ onClose, referenceRef }) => (
        <Menu minWidth={referenceRef.current?.clientWidth} maxWidth={referenceRef.current?.clientWidth}>
          {options.map(
            (option) =>
              option && <Menu.Item key={option.id} label={option.label} onClick={stopPropagation(Utils.functional.chain(option.onClick, onClose))} />
          )}
        </Menu>
      )}
    </Popper>
  );
};
