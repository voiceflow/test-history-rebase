/* eslint-disable lodash/prefer-constant */
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import '@/App.css';

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { ModalBackdrop } from '@/components/LegacyModal';
import { DragProvider, IdentityContext, ModalsContext } from '@/contexts';
import { createGlobalStyle } from '@/hocs';
import { StepAPIContext } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { identity, noop } from '@/utils/functional';
import { ReduxProvider, ThemeProvider } from '@/utils/testing';

import { StoryDetails } from './components';
import { StoryContext } from './contexts';

const StorybookStyles = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    min-height: 100%;
  }
`;

const globalDecorator = (Component) => (
  <ThemeProvider>
    <StorybookStyles />
    <Component />
  </ThemeProvider>
);

export default globalDecorator;

export const composeDecorators = (...decorators) => (story) => decorators.reverse().reduce((acc, decorator) => () => decorator(acc), story);
export const composeDecorators2 = (...decorators) => (story) => decorators.reverse().reduce((acc, decorator) => decorator(acc), story);

export const withRedux = (state = {}) => (Component) => (
  <ReduxProvider state={state}>
    <Component />
  </ReduxProvider>
);

export const withModalContext = (openedId) => (Component) => (
  <ModalsContext.Provider value={{ openedId, open: noop, toggle: noop, modalData: {}, stackModalIds: [openedId] }}>
    <ModalBackdrop />
    <Component />
  </ModalsContext.Provider>
);

export const withIdentityContext = (activeRole = null, activePlan = null) => (Component) => (
  <IdentityContext.Provider value={{ activeRole, activePlan }}>
    <Component />
  </IdentityContext.Provider>
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

export const withContext = (Context, value) => (story) => () => <Context.Provider value={value}>{story()}</Context.Provider>;

const mockLogger = {
  child: () => mockLogger,
  debug: noop,
  init: noop,
  slug: noop,
  value: noop,
};

export const withEngine = (engine) =>
  withContext(EngineContext, {
    log: mockLogger,
    select: () => () => null,
    registerPort: () => null,
    expirePort: () => null,
    ...engine,
  });

export const withStepContext = ({ withPorts = true, isActive = false, isConnected = false, lockOwner = null } = {}) =>
  composeDecorators2(
    withContext(StepAPIContext, {
      isActive,
      withPorts,
      wrapElement: identity,
    }),
    withContext(NodeEntityContext, {
      log: mockLogger,
      lockOwner,
      inPortID: 'abc',
      useState: () => ({}),
    }),
    withEngine({
      getPortByID: () => true,
      getLinkIDsByPortID: () => (isConnected ? ['def'] : []),
      highlight: {
        isPortTarget: () => false,
      },
      dispatcher: {
        useSubscription: noop,
      },
      port: {
        redrawLinks: noop,
      },
    })
  );
