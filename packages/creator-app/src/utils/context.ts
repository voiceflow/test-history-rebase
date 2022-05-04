import { Nullable } from '@voiceflow/common';
import React from 'react';

export const createUseContext =
  <C extends Nullable<object>>(context: React.Context<C>) =>
  (): C =>
    React.useContext<C>(context);
