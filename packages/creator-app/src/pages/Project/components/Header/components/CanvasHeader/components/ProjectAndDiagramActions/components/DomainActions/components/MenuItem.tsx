import {
  Box,
  Divider,
  Dropdown,
  getNestedMenuFormattedLabel,
  Menu as UIMenu,
  OverflowText,
  OverflowTippyTooltip,
  stopPropagation,
  SvgIcon,
  Toggle,
} from '@voiceflow/ui';
import React from 'react';

interface MenuItemProps {
  id: string;
  name: string;
  search: string;
  isHome?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, isHome, search, onClick }) => {
  return (
    <Dropdown
      menu={() => (
        <UIMenu width={177} noBottomPadding>
          <UIMenu.Item>Rename</UIMenu.Item>
          <UIMenu.Item>Duplicate</UIMenu.Item>

          {!isHome && (
            <>
              <Divider offset={8} isSecondaryColor />
              <UIMenu.Item>Delete</UIMenu.Item>
            </>
          )}

          <Divider offset={[8, 0]} isSecondaryColor />
          <UIMenu.Item disabled={isHome} ending>
            <Box mr="auto">Is live</Box>
            <Toggle size={Toggle.Size.EXTRA_SMALL} />
          </UIMenu.Item>
        </UIMenu>
      )}
      offset={{ offset: [-14, 24] }}
      placement="right-start"
      selfDismiss
    >
      {(ref, onToggle, isOpened) => (
        <UIMenu.Item active={isOpened} onClick={onClick}>
          <OverflowTippyTooltip title={name} overflow>
            {(ref) => (
              <>
                {isHome && <SvgIcon mr={16} variant={SvgIcon.Variant.STANDARD} icon="returnHome" />}
                <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
              </>
            )}
          </OverflowTippyTooltip>

          <UIMenu.ActionIcon ref={ref} icon="toggles" onClick={stopPropagation(onToggle)} active={isOpened} />
        </UIMenu.Item>
      )}
    </Dropdown>
  );
};

export default MenuItem;
