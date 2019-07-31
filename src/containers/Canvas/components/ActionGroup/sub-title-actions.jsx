import React from 'react';
import { Tooltip } from 'react-tippy';

import RoundButton from '@/components/Button/RoundButton';
import ShareTest from '@/containers/Testing/ShareTest';

import { SubTitleGroup } from './styled';

export default function SubTitleActions({ activeButton, onButtonClick }) {
  return (
    <>
      <SubTitleGroup>
        <Tooltip title="Settings" position="bottom">
          <RoundButton active={activeButton} icon="cog" onClick={onButtonClick} imgSize={15} />
        </Tooltip>
      </SubTitleGroup>
      <SubTitleGroup>
        <ShareTest render />
      </SubTitleGroup>
    </>
  );
}
