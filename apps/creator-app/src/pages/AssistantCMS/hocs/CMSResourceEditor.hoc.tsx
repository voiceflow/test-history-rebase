import { useCreateConst } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';
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
      const drawerNode = useCreateConst(() => atom<HTMLDivElement | null>(null));

      return (
        <CMSResourceEditorProvider drawerNode={drawerNode}>
          <CMSResourceEditor drawerNode={drawerNode} Editor={Editor}>
            <Component />
          </CMSResourceEditor>
        </CMSResourceEditorProvider>
      );
    });
