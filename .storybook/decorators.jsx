/* eslint-disable lodash/prefer-constant */
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import '@/App.css';

import { action } from '@storybook/addon-actions';
import _noop from 'lodash/noop';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { ModalBackdrop } from '@/components/LegacyModal';
import { DragProvider } from '@/contexts';
import { ModalsContext } from '@/contexts/ModalsContext';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ReduxProvider, ThemeProvider } from '@/utils/testing';

import { StoryDetails } from './components';
import { StoryContext } from './contexts';

const globalDecorator = (Component) => (
  <ThemeProvider>
    <Component />
  </ThemeProvider>
);

export default globalDecorator;

export const composeDecorators = (...decorators) => (story) => decorators.reverse().reduce((acc, decorator) => () => decorator(acc), story);

export const withRedux = (state = {}) => (Component) => (
  <ReduxProvider state={state}>
    <Component />
  </ReduxProvider>
);

export const withModalContext = (openedId) => (Component) => (
  <ModalsContext.Provider value={{ openedId, open: _noop, toggle: _noop, modalData: {}, stackModalIds: [openedId] }}>
    <ModalBackdrop />
    <Component />
  </ModalsContext.Provider>
);

// eslint-disable-next-line xss/no-mixed-html
export const withDnD = (Component) => (
  <DndProvider backend={HTML5Backend}>
    <DragProvider>
      <Component />
    </DragProvider>
  </DndProvider>
);

export const withStoryDetails = (Component) => (
  <StoryContext.Consumer>
    {(context) => {
      const el = <Component />;

      if (!context) {
        return el;
      }

      return (
        <StoryDetails name={context.name} labeled={context.labeled}>
          {el}
        </StoryDetails>
      );
    }}
  </StoryContext.Consumer>
);

export const withEngine = (engine) => (story) => () => (
  <EngineContext.Provider
    value={{
      registerPort: () => null,
      expirePort: () => null,
      ...engine,
    }}
  >
    {story()}
  </EngineContext.Provider>
);

export const withStepDispatcher = ({ hasActiveLinks = false, lockOwner = false, onClick = action('click port') } = {}) =>
  withEngine({
    dispatcher: {
      usePort: () => ({ hasActiveLinks, onClick }),
      useNode: () => ({
        lockOwner: lockOwner
          ? {
              name: 'Mike',
              email: 'mike@test.com',
              role: 'editor',
              image: 'E760D4|FCEFFB',
              creator_id: 4,
              seats: 1,
              created: null,
              color: '36B4D2|ECF8FA',
            }
          : null,
      }),
    },
  });
