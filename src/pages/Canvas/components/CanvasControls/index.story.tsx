import { action } from '@storybook/addon-actions';
import React from 'react';

import { composeDecorators, withModalContext, withRedux } from '@/../.storybook';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { EventualEngineProvider, RegisterEngine } from '@/contexts/EventualEngineContext';
import { EditPermissionProvider } from '@/pages/Skill/contexts';

import CanvasControlsV2 from '.';

export default {
  title: 'Creator/Canvas Controls',
  component: CanvasControlsV2,
};

// eslint-disable-next-line react/display-name
const createStory = (isTemplates = false) =>
  composeDecorators(
    withRedux({
      workspace: {
        activeWorkspaceID: 'a',
        byId: {
          a: { templates: isTemplates },
        },
      },
    }),
    withModalContext(ModalType.INTERACTION_MODEL),
    (Component: React.FC) => (
      <TextEditorVariablesPopoverProvider value={document.body}>
        <EventualEngineProvider>
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
        </EventualEngineProvider>
      </TextEditorVariablesPopoverProvider>
    )
  );

export const base = createStory()(() => <CanvasControlsV2 />);

export const withTemplates = createStory(true)(() => <CanvasControlsV2 />);
