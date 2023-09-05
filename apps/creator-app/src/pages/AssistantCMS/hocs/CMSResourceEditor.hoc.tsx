import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { CMSResourceEditor } from '../components/CMSResourceEditor/CMSResourceEditor.component';

interface IWithCMSResourceEditor {
  Editor: React.FC;
}

export const withCMSResourceEditor =
  ({ Editor }: IWithCMSResourceEditor) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSResourceEditor'))(() => (
      <>
        <CMSResourceEditor Editor={Editor}>
          <Component />
        </CMSResourceEditor>
      </>
    ));
