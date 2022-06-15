import { Box, Dropdown, MenuOption } from '@voiceflow/ui';
import React from 'react';

import { StyledLogoButton } from './components';

interface LogoButtonProps {
  options: MenuOption<undefined>[];
  expandable?: boolean;
  noMargins?: boolean;
}

const LogoButton: React.FC<LogoButtonProps> = ({ options, expandable = true, noMargins = false }) => (
  <Box.Flex mr={noMargins ? 0 : 16} height="100%">
    <Dropdown options={options} offset={{ offset: [16, 6] }} menuWidth={240} maxVisibleItems={options.length}>
      {(ref, onToggle, isOpened) => <StyledLogoButton ref={ref} onClick={onToggle} active={isOpened} expandable={expandable} />}
    </Dropdown>
  </Box.Flex>
);

export default LogoButton;
