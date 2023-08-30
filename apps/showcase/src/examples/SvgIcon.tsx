import { Box, Input, Popper, SectionV2, SvgIcon, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const blueVariant = createExample('blue', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.BLUE} />);
const whiteVariant = createExample('white', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.WHITE} />);
const popoverVariant = createExample('popover', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.POPOVER} />);
const standardVariant = createExample('standard', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.STANDARD} />);
const tertiaryVariant = createExample('tertiary', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.TERTIARY} />);
const secondaryVariant = createExample('secondary', () => <SvgIcon icon="edit" variant={SvgIcon.Variant.SECONDARY} />);
const sizedIcon = createExample('sized', () => <SvgIcon icon="edit" size={20} variant={SvgIcon.Variant.STANDARD} />);
const coloredIcon = createExample('colored', () => <SvgIcon icon="edit" color="#212121" />);
const spinIcon = createExample('spin', () => <SvgIcon icon="edit" spin variant={SvgIcon.Variant.STANDARD} />);
const clickableIcon = createExample('clickable', () => <SvgIcon icon="edit" clickable variant={SvgIcon.Variant.STANDARD} />);
const allIcons = createExample(
  'all icons',
  ({ isPage }) => {
    const [search, setSearch] = React.useState('');

    const icons = (
      <div style={{ width: '100%' }}>
        <Box.Flex m="auto" pb={12} width={200}>
          <Input value={search} onChangeText={setSearch} placeholder="Search icon" />
        </Box.Flex>

        <Box.Flex flexWrap="wrap">
          {Object.keys(SvgIcon.ICONS).map(
            (icon) =>
              (!search || icon.includes(search)) && (
                <Popper
                  key={icon}
                  renderContent={() => (
                    <Box.Flex p={12} column>
                      <SvgIcon icon={icon as SvgIconTypes.Icon} color="#212121" size={80} />

                      <Box.Flex pt={8} color="#313131" fontSize={13}>
                        {icon}
                      </Box.Flex>
                    </Box.Flex>
                  )}
                >
                  {({ ref, onToggle }) => (
                    <Box.Flex
                      ref={ref}
                      cursor="pointer"
                      width={40}
                      height={40}
                      onClick={() => navigator.clipboard.writeText(icon)}
                      onMouseEnter={onToggle}
                      onMouseLeave={onToggle}
                      justifyContent="center"
                    >
                      <SvgIcon icon={icon as SvgIconTypes.Icon} variant={SvgIcon.Variant.STANDARD} />
                    </Box.Flex>
                  )}
                </Popper>
              )
          )}
        </Box.Flex>
      </div>
    );

    return isPage ? (
      icons
    ) : (
      <SectionV2.CollapseSection header={({ collapsed }) => (collapsed ? 'show' : 'hide')} containerToggle defaultCollapsed={!isPage}>
        <SectionV2.Content>{icons}</SectionV2.Content>
      </SectionV2.CollapseSection>
    );
  },
  { fullWidth: true }
);

export default createSection('SvgIcon', 'src/components/SvgIcon/index.tsx', [
  secondaryVariant,
  blueVariant,
  whiteVariant,
  popoverVariant,
  standardVariant,
  tertiaryVariant,
  sizedIcon,
  coloredIcon,
  spinIcon,
  clickableIcon,
  allIcons,
]);
