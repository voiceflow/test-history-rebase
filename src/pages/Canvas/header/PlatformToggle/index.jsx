import React from 'react';

import DropdownWithCaret from '@/components/DropdownWithCaret';
import { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { PLATFORMS, PlatformType } from '@/constants';

export const PLATFORM_LABELS = {
  [PlatformType.ALEXA]: 'Amazon Alexa',
  [PlatformType.GOOGLE]: 'Google Assistant',
};

function PlatformToggle({ platform, onToggle, disabled }) {
  return (
    <DropdownWithCaret
      padding="10px 0px"
      disabled={disabled}
      text={PLATFORM_LABELS[platform]}
      menu={
        <Menu>
          {PLATFORMS.map((platformType) => {
            return (
              <MenuItem
                onClick={() => {
                  if (platform !== platformType) onToggle();
                }}
                key={platformType}
              >
                <FlexApart style={{ width: '100%' }}>
                  {PLATFORM_LABELS[platformType]}
                  {platformType === platform && <SvgIcon style={{ marginLeft: '25px' }} icon="blocks" color="#becedc" />}
                </FlexApart>
              </MenuItem>
            );
          })}
        </Menu>
      }
    />
  );
}

export default PlatformToggle;
