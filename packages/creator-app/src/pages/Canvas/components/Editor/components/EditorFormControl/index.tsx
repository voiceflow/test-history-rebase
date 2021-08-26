import React from 'react';

import InfoIcon, { InfoIconProps } from '@/components/InfoIcon';

import { Content, Label } from './components';

export interface EditorFormControlProps {
  label?: React.ReactNode;
  contentBottomUnits?: number;
  tooltip?: React.ReactNode;
  tooltipProps?: InfoIconProps['tooltipProps'];
}

const EditorFormControl: React.FC<EditorFormControlProps> = ({ label, children, contentBottomUnits, tooltip, tooltipProps }) => (
  <>
    {label && (
      <Label>
        {label}
        {tooltip && <InfoIcon tooltipProps={tooltipProps}>{tooltip}</InfoIcon>}
      </Label>
    )}
    {children && <Content contentBottomUnits={contentBottomUnits}>{children}</Content>}
  </>
);

export default EditorFormControl;
