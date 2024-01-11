import { useCreateConst } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AnyModal } from '@/ModalsV2/types';

import { CMSResourceEditor } from '../components/CMSResourceEditor/CMSResourceEditor.component';
import { CMSResourceEditorProvider } from '../components/CMSResourceEditor/CMSResourceEditor.provider';

interface IWithCMSResourceEditor {
  Editor: React.FC;
  modals?: Record<string, AnyModal>;
}

export const withCMSResourceEditor =
  ({ Editor, modals }: IWithCMSResourceEditor) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSResourceEditor'))(() => {
      const drawerNode = useCreateConst(() => atom<HTMLDivElement | null>(null));

      return (
        <CMSResourceEditorProvider drawerNode={drawerNode}>
          <CMSResourceEditor drawerNode={drawerNode} Editor={Editor} modals={modals}>
            <Component />
          </CMSResourceEditor>
        </CMSResourceEditorProvider>
      );
    });
