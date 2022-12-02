import { Nullable } from '@voiceflow/common';
import { Box, Dropdown, MenuTypes } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface LogoButtonProps {
  style?: React.CSSProperties;
  options: Nullable<MenuTypes.OptionWithoutValue>[];
  noMargins?: boolean;
  expandable?: boolean;
  withBorder?: boolean;
}

const LogoButton: React.FC<LogoButtonProps> = ({ options, expandable = true, noMargins = false, withBorder = true, style }) => (
  <Box.Flex mr={noMargins ? 0 : 16} height="100%" style={style}>
    <Dropdown options={options} offset={{ offset: [16, 6] }} menuWidth={240} maxVisibleItems={options.length}>
      {(ref, onToggle, isOpened) => (
        <S.StyledLogoButton ref={ref} onClick={onToggle} active={isOpened} expandable={expandable} withBorder={withBorder} />
      )}
    </Dropdown>
  </Box.Flex>
);

export default LogoButton;
