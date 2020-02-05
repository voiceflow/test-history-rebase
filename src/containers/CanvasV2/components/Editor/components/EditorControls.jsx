import React from 'react';

import Button from '@/componentsV2/Button';
import Flex, { FlexApart } from '@/componentsV2/Flex';
import { ManagerContext } from '@/containers/CanvasV2/contexts';
import { styled, units } from '@/hocs';

import EditorTutorial from './EditorTutorial';

const ControlsContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-left: ${units()}px;
  }

  & > *:not(:last-child) {
    margin-right: ${units()}px;
  }
`;

const EditorControls = ({ tutorial, anchor, tutorialTitle, options = [], menu, children }) => {
  const getManager = React.useContext(ManagerContext);

  return (
    <FlexApart fullWidth>
      {tutorial && (
        <EditorTutorial
          anchor={anchor}
          tutorialTitle={tutorialTitle}
          title={getManager(tutorial.blockType)?.label || 'Block'}
          helpTitle={tutorial.helpTitle}
          helpMessage={tutorial.helpMessage}
        >
          {tutorial.content}
        </EditorTutorial>
      )}
      <div>{children}</div>
      <ControlsContainer>
        {menu}
        {options.map(({ label, icon, onClick, variant = 'secondary', disabled = false }) => (
          <Button variant={variant} icon={icon} onClick={onClick} key={label} disabled={disabled}>
            {label}
          </Button>
        ))}
      </ControlsContainer>
    </FlexApart>
  );
};

export default EditorControls;
