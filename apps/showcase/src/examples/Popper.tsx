import { Popper } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { createExample, createSection } from './utils';

const standard = createExample('primary', () => (
  <Popper renderContent={() => <Popper.Content>Content is here</Popper.Content>}>
    {({ ref, isOpened, onToggle }) => (
      <button ref={ref} onClick={onToggle}>
        Click me to {isOpened ? 'Close' : 'Open'}
      </button>
    )}
  </Popper>
));

const withFooter = createExample('with footer', () => (
  <Popper
    renderFooter={({ onClose }) => (
      <Popper.Footer>
        <button onClick={onClose}>close</button>
      </Popper.Footer>
    )}
    renderContent={() => <Popper.Content>Content is here</Popper.Content>}
  >
    {({ ref, isOpened, onToggle }) => (
      <button ref={ref} onClick={onToggle}>
        Click me to {isOpened ? 'Close' : 'Open'}
      </button>
    )}
  </Popper>
));

const withNav = createExample('with nav', ({ isPage }) => (
  <Popper
    renderNav={() => (
      <>
        <Popper.Nav>
          <Popper.NavItem to="/item-1">Item 1</Popper.NavItem>
          <Popper.NavItem to="/item-2">Item 2</Popper.NavItem>
        </Popper.Nav>
      </>
    )}
    renderFooter={({ onClose }) => (
      <Popper.Footer>
        <button onClick={onClose}>close</button>
      </Popper.Footer>
    )}
    renderContent={() => (
      <Popper.Content>
        <Switch>
          <Route path="/item-1">Item 1 content</Route>
          <Route path="/item-2">Item 2 content</Route>
        </Switch>
      </Popper.Content>
    )}
    initialOpened={isPage}
  >
    {({ ref, isOpened, onToggle }) => (
      <button ref={ref} onClick={onToggle}>
        Click me to {isOpened ? 'Close' : 'Open'}
      </button>
    )}
  </Popper>
));

export default createSection('Popper', 'src/components/Popper/index.tsx', [standard, withFooter, withNav]);
