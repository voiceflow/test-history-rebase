import { TutorialInfoIcon, TutorialInfoIconProps } from '@voiceflow/ui';
import React from 'react';

import { Content, Label } from './components';

export interface EditorFormControlProps {
  label?: React.ReactNode;
  contentBottomUnits?: number;
  tooltip?: React.ReactNode;
  tooltipProps?: TutorialInfoIconProps['tooltipProps'];
}

const EditorFormControl: React.OldFC<EditorFormControlProps> = ({ label, children, contentBottomUnits, tooltip, tooltipProps }) => (
  <>
    {label && (
      <Label>
        {label}
        {tooltip && <TutorialInfoIcon tooltipProps={tooltipProps}>{tooltip}</TutorialInfoIcon>}
      </Label>
    )}
    {children && <Content contentBottomUnits={contentBottomUnits}>{children}</Content>}
  </>
);

export default EditorFormControl;
