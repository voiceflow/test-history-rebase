import React from 'react';

import DropdownWithCaret from '@/components/DropdownWithCaret';
import Flex, { FlexApart } from '@/components/Flex';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { Link } from '@/components/Text';
import { PLATFORMS, PLATFORM_META, PlatformType } from '@/constants';

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
        <Menu noBottomPadding>
          {PLATFORMS.map((platformType) => {
            if (PLATFORM_META[platformType].hidden) return;
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
          <MenuItem divider />
          <MenuItem disabled teamItem>
            <Flex style={{ width: '100%' }}>
              Custom Assistant?
              <Link href="https://www.voiceflow.com/custom-assistant" marginLeft={5}>
                See More
              </Link>
            </Flex>
          </MenuItem>
        </Menu>
      }
    />
  );
}

export default PlatformToggle;
