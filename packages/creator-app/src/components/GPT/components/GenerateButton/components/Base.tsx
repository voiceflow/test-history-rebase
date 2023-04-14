import composeRef from '@seznam/compose-react-refs';
import { Nullable, Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, Dropdown, MenuTypes, SvgIcon, useDebouncedCallback } from '@voiceflow/ui';
import React from 'react';

export interface BaseGenerateButtonProps extends React.PropsWithChildren {
  options: Nullable<MenuTypes.Option>[];
  subtext?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  menuHint?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  hoverOpen?: boolean;
}

const MIN_MENU_WIDTH = 350;

const BaseGenerateButton: React.FC<BaseGenerateButtonProps> = ({
  options,
  onClick,
  menuHint,
  disabled,
  children,
  fullWidth = true,
  isLoading,
  hoverOpen,
}) => {
  const [buttonNode, setButtonNode] = React.useState<HTMLButtonElement | null>(null);

  const menuWidth = Math.max(buttonNode?.clientWidth || 0, MIN_MENU_WIDTH);

  const onDebouncedMouseEnter = useDebouncedCallback(120, (toggle: VoidFunction) => toggle());

  return (
    <Dropdown options={options} menuWidth={menuWidth} menuHint={menuHint} selfDismiss inlinePopper={hoverOpen}>
      {({ ref, onToggle, isOpen, popper }) => (
        <Button
          ref={composeRef(setButtonNode, ref)}
          name="aiGenerate"
          onClick={hoverOpen ? onClick : Utils.functional.chain(onClick, onToggle)}
          variant={ButtonVariant.PRIMARY}
          isActive={isOpen}
          disabled={isLoading || disabled}
          isLoading={isLoading}
          fullWidth={fullWidth}
          onMouseLeave={Utils.functional.chain(() => hoverOpen && isOpen && onToggle(), onDebouncedMouseEnter.cancel)}
          onMouseEnter={() => hoverOpen && !isOpen && onDebouncedMouseEnter(onToggle)}
        >
          <Box.Flex gap={8}>
            <SvgIcon icon="aiSmall" />
            <div>{children || 'Generate'}</div>
          </Box.Flex>

          {popper}
        </Button>
      )}
    </Dropdown>
  );
};

export default BaseGenerateButton;
