import React from 'react';

import { Content, Label } from './components';

export type EditorFormControlProps = {
  label?: React.ReactNode;
  contentBottomUnits?: number;
};

const EditorFormControl: React.FC<EditorFormControlProps> = ({ label, children, contentBottomUnits }) => (
  <>
    {label && <Label>{label}</Label>}
    {children && <Content contentBottomUnits={contentBottomUnits}>{children}</Content>}
  </>
);

export default EditorFormControl;
