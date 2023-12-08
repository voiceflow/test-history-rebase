import React, { useRef } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { CMSResourceEditor } from '../components/CMSResourceEditor/CMSResourceEditor.component';
import { CMSResourceEditorProvider } from '../components/CMSResourceEditor/CMSResourceEditor.provider';

interface IWithCMSResourceEditor {
  Editor: React.FC;
}

export const withCMSResourceEditor =
  ({ Editor }: IWithCMSResourceEditor) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSResourceEditor'))(() => {
      const drawerRef = useRef<HTMLDivElement>(null);

      return (
        <CMSResourceEditorProvider drawerRef={drawerRef}>
          <CMSResourceEditor drawerRef={drawerRef} Editor={Editor}>
            <Component />
          </CMSResourceEditor>
        </CMSResourceEditorProvider>
      );
    });
