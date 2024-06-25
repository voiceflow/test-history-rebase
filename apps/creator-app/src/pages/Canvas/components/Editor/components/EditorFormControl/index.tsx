import type { TutorialInfoIconProps } from '@voiceflow/ui';
import { TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { Content, Label } from './components';

export interface EditorFormControlProps extends React.PropsWithChildren {
  label?: React.ReactNode;
  contentBottomUnits?: number;
  tooltip?: React.ReactNode;
  tooltipProps?: TutorialInfoIconProps['tooltipProps'];
}

const EditorFormControl: React.FC<EditorFormControlProps> = ({
  label,
  children,
  contentBottomUnits,
  tooltip,
  tooltipProps,
}) => (
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
