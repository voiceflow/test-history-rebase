import type { SvgIconTypes } from '@voiceflow/ui';
import { Button, ButtonVariant, FlexApart } from '@voiceflow/ui';
import React from 'react';

import type { BlockType } from '@/constants';
import { ManagerContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import ControlsContainer from './ControlsContainer';
import EditorTutorial from './EditorTutorial';

export interface ControlOptions {
  icon?: SvgIconTypes.Icon;
  label: string;
  onClick: React.MouseEventHandler;
  variant?: ButtonVariant;
  disabled?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

export interface EditorControlsProps extends React.PropsWithChildren {
  tutorial?: {
    content: React.ReactNode;
    blockType?: BlockType;
    helpTitle?: React.ReactNode;
    helpMessage?: React.ReactNode;
  };
  menu?: React.ReactNode;
  anchor?: React.ReactNode;
  options?: ControlOptions[];
  tutorialTitle?: React.ReactNode;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  tutorial,
  anchor,
  tutorialTitle,
  options = [],
  menu,
  children,
}) => {
  const getManager = React.useContext(ManagerContext)!;

  return (
    <FlexApart fullWidth>
      {tutorial && (
        <EditorTutorial
          anchor={anchor}
          title={(tutorial.blockType && getManager(tutorial.blockType)?.label) || 'Block'}
          helpTitle={tutorial?.helpTitle}
          helpMessage={tutorial?.helpMessage}
          tutorialTitle={tutorialTitle}
        >
          {tutorial.content}
        </EditorTutorial>
      )}

      <div>{children}</div>

      <ControlsContainer>
        {menu}
        {options.map(({ label, icon, onClick, variant = ButtonVariant.SECONDARY, disabled = false }) => (
          <Button
            className={ClassName.EDITOR_FOOTER_BUTTON}
            variant={variant}
            icon={icon}
            onClick={onClick}
            key={label}
            disabled={disabled}
          >
            {label}
          </Button>
        ))}
      </ControlsContainer>
    </FlexApart>
  );
};

export default EditorControls;
