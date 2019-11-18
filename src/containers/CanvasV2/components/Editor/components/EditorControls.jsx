import React from 'react';

import Button from '@/componentsV2/Button';
import Flex, { FlexApart } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const ControlsContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-left: ${units()}px;
  }

  & > *:not(:last-child) {
    margin-right: ${units()}px;
  }
`;

const EditorControls = ({ options, menu, children }) => (
  <FlexApart fullWidth>
    <div>{children}</div>
    <ControlsContainer>
      {menu}
      {options.map(({ label, icon, onClick }) => (
        <Button variant="secondary" icon={icon} onClick={onClick} key={label}>
          {label}
        </Button>
      ))}
    </ControlsContainer>
  </FlexApart>
);

export default EditorControls;
