import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Dropdown, MenuTypes } from '@voiceflow/ui';
import React from 'react';

import { useFeature } from '@/hooks/feature';

import * as S from './styles';

interface LogoButtonProps {
  style?: React.CSSProperties;
  options: Nullable<MenuTypes.OptionWithoutValue>[];
  noMargins?: boolean;
  expandable?: boolean;
  withBorder?: boolean;
}

const LogoButton: React.FC<LogoButtonProps> = ({ options, expandable = true, noMargins = false, withBorder = true, style }) => {
  const useUpdatedBranding = useFeature(Realtime.FeatureFlag.BRANDING_UPDATE).isEnabled;

  return (
    <Box.Flex mr={noMargins ? 0 : 16} height="100%" style={style}>
      <Dropdown options={options} offset={{ offset: [16, 6] }} menuWidth={240} maxVisibleItems={options.length}>
        {({ ref, onToggle, isOpen }) => (
          <S.StyledLogoButton
            ref={ref}
            icon={useUpdatedBranding ? 'voiceflowLogomark' : 'voiceflowV'}
            active={isOpen}
            onClick={onToggle}
            iconProps={{ color: '#000', size: 30 }}
            expandable={expandable}
            withBorder={withBorder}
            data-testid="header-logo-button"
          />
        )}
      </Dropdown>
    </Box.Flex>
  );
};

export default LogoButton;
