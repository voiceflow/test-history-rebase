import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { SvgIconProps } from '@/components/SvgIcon';
import { BlockType } from '@/constants';
import { ManagerContext } from '@/pages/Canvas/contexts';

import ControlsContainer from './ControlsContainer';
import EditorTutorial from './EditorTutorial';

export type ControlOptions = {
  icon?: SvgIconProps['icon'];
  label: string;
  onClick: React.MouseEventHandler;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export type EditorControlsProps = {
  tutorial?: {
    content: React.ReactNode;
    blockType: BlockType;
    helpTitle?: React.ReactNode;
    helpMessage?: React.ReactNode;
  };
  menu?: React.ReactNode;
  anchor?: React.ReactNode;
  options?: ControlOptions[];
  tutorialTitle?: React.ReactNode;
};

const EditorControls: React.FC<EditorControlsProps> = ({ tutorial, anchor, tutorialTitle, options = [], menu, children }) => {
  const getManager = React.useContext(ManagerContext)!;

  return (
    <FlexApart fullWidth>
      {tutorial && (
        <EditorTutorial
          anchor={anchor}
          tutorialTitle={tutorialTitle}
          title={getManager(tutorial.blockType)?.label || 'Block'}
          helpTitle={tutorial?.helpTitle}
          helpMessage={tutorial?.helpMessage}
        >
          {tutorial.content}
        </EditorTutorial>
      )}
      <div>{children}</div>
      <ControlsContainer>
        {menu}
        {options.map(({ label, icon, onClick, variant = ButtonVariant.SECONDARY, disabled = false }) => (
          <Button variant={variant} icon={icon} onClick={onClick} key={label} disabled={disabled}>
            {label}
          </Button>
        ))}
      </ControlsContainer>
    </FlexApart>
  );
};

export default EditorControls;
