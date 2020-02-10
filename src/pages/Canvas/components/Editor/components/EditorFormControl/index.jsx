import React from 'react';

import { Content, Label } from './components';

const EditorFormControl = ({ label, children, contentBottomUnits }) => (
  <>
    {label && <Label>{label}</Label>}
    {children && <Content contentBottomUnits={contentBottomUnits}>{children}</Content>}
  </>
);

export default EditorFormControl;
