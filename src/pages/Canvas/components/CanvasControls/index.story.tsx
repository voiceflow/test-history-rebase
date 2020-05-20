import { action } from '@storybook/addon-actions';
import React from 'react';

import { composeDecorators, withModalContext, withRedux } from '@/../.storybook';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { EventualEngineProvider, RegisterEngine } from '@/contexts/EventualEngineContext';
import { EditPermissionProvider, ShortcutModalProvider } from '@/pages/Skill/contexts';

import CanvasControlsV2 from '.';

export default {
  title: 'Creator/Canvas Controls',
  component: CanvasControlsV2,
};

// eslint-disable-next-line react/display-name
const createStory = () =>
  composeDecorators(withRedux(), withModalContext(ModalType.INTERACTION_MODEL), (Component: React.FC) => (
    <TextEditorVariablesPopoverProvider value={document.body}>
      <EventualEngineProvider>
        <ShortcutModalProvider>
          <EditPermissionProvider isPrototyping>
            <RegisterEngine
              engine={
                {
                  canvas: {
                    zoomIn: action('zoomIn'),
                    zoomOut: action('zoomOut'),
                    applyTransition: action('applyTransition'),
                  },
                } as any
              }
            />

            <Component />
          </EditPermissionProvider>
        </ShortcutModalProvider>
      </EventualEngineProvider>
    </TextEditorVariablesPopoverProvider>
  ));

export const base = createStory()(() => <CanvasControlsV2 />);
