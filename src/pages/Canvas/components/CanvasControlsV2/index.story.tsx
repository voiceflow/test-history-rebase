import { action } from '@storybook/addon-actions';
import React from 'react';

import { composeDecorators, withModalContext } from '@/../.storybook';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { EventualEngineProvider, RegisterEngine } from '@/contexts/EventualEngineContext';
import { ShortcutModalProvider } from '@/pages/Canvas/contexts';

import CanvasControlsV2 from '.';

export default {
  title: 'Creator/Canvas Controls',
  component: CanvasControlsV2,
};

// eslint-disable-next-line react/display-name
const createStory = () =>
  composeDecorators(withModalContext(ModalType.INTERACTION_MODEL), (Component: React.FC) => (
    <TextEditorVariablesPopoverProvider value={document.body}>
      <EventualEngineProvider>
        <ShortcutModalProvider>
          <RegisterEngine
            engine={{
              canvas: {
                zoomIn: action('zoomIn'),
                zoomOut: action('zoomOut'),
                applyTransition: action('applyTransition'),
              },
            }}
          />

          <Component />
        </ShortcutModalProvider>
      </EventualEngineProvider>
    </TextEditorVariablesPopoverProvider>
  ));

export const base = createStory()(() => <CanvasControlsV2 />);
