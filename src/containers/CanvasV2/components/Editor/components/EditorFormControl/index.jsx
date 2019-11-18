import React from 'react';

import { Content, Label } from './components';

const EditorFormControl = ({ label, children }) => (
  <>
    {label && <Label>{label}</Label>}
    <Content>{children}</Content>
  </>
);

export default EditorFormControl;
