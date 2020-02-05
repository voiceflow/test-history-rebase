import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import '@/App.css';

import _noop from 'lodash/noop';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { DragProvider } from '@/contexts';
import { ModalsContext } from '@/contexts/ModalsContext';
import { ThemeProvider, ReduxProvider } from '@/utils/testing';

import { StoryContext } from './contexts';
import { StoryDetails } from './components';

const globalDecorator = (Component) => (
  <ThemeProvider>
    <Component />
  </ThemeProvider>
);

export default globalDecorator;

export const composeDecorators = (...decorators) => (story) => decorators.reverse().reduce((acc, decorator) => () => decorator(acc), story);

export const asDecorator = (hoc) => (Component) => {
  const Wrapped = hoc(() => <Component />);

  return <Wrapped />;
};

export const withRedux = (state = {}) => (Component) => (
  <ReduxProvider state={state}>
    <Component />
  </ReduxProvider>
);

export const withModalContext = (openedId) => (Component) => (
  <ModalsContext.Provider value={{ openedId, open: _noop, toggle: _noop, modalData: {} }}>
    <Component />
  </ModalsContext.Provider>
);

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
