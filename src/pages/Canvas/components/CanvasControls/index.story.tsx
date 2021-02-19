import { composeDecorators, withIdentityContext, withModalContext, withRedux } from '_storybook';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { EventualEngineProvider, RegisterEngine } from '@/contexts/EventualEngineContext';

import CanvasControls from '.';

export default {
  title: 'Creator/Canvas Controls',
  component: CanvasControls,
};

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
    withIdentityContext(),
    (Component: React.FC) => (
      <TextEditorVariablesPopoverProvider value={document.body}>
        <EventualEngineProvider>
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
        </EventualEngineProvider>
      </TextEditorVariablesPopoverProvider>
    )
  );

export const base = createStory()(() => <CanvasControls />);

export const withTemplates = createStory(true)(() => <CanvasControls />);
