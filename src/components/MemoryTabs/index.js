import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import { MemoryTabsContextConsumer } from 'contexts';

import Transition from '../Transition';

export function MemoryTab({ tab, exact, render, ...props }) {
  return (
    <MemoryTabsContextConsumer>
      {({ activeTab, activeTabState }) => {
        const match = matchPath(activeTab, { path: tab, exact, ...props });

        if (match) {
          return render(match, activeTabState);
        }

        return null;
      }}
    </MemoryTabsContextConsumer>
  );
}

export function MemoryTabTransition({ tab, exact, render, ...props }) {
  return (
    <MemoryTabsContextConsumer>
      {({ activeTab, activeTabState }) => {
        const match = matchPath(activeTab, { path: tab, exact, ...props });

        return match ? (
          <Transition className="memory-tab-transition" {...props}>
            {render(match, activeTabState)}
          </Transition>
        ) : null;
      }}
    </MemoryTabsContextConsumer>
  );
}

export function MemoryTabLink(props) {
  return (
    <MemoryTabsContextConsumer>
      {({ onChangeActiveTab }) => {
        const { to, state, innerRef, disabled, Component, ...ownProps } = props;

        return (
          <Component
            {...ownProps}
            ref={innerRef}
            onClick={() => !disabled && onChangeActiveTab(to, state)}
          />
        );
      }}
    </MemoryTabsContextConsumer>
  );
}

export function MemoryTabSwitch({ children }) {
  return (
    <MemoryTabsContextConsumer>
      {({ activeTab }) => {
        const arr = Children.toArray(children);

        const child = arr.find(({ props }) => matchPath(activeTab, { path: props.tab, ...props }));

        return child || null;
      }}
    </MemoryTabsContextConsumer>
  );
}

MemoryTab.propTypes = {
  tab: PropTypes.string,
  exact: PropTypes.bool,
  render: PropTypes.func,
};

MemoryTab.defaultProps = {
  exact: true,
};

MemoryTabTransition.propTypes = {
  tab: PropTypes.string,
  exact: PropTypes.bool,
  render: PropTypes.func,
};

MemoryTabTransition.defaultProps = {
  exact: true,
};

MemoryTabLink.propTypes = {
  to: PropTypes.string.isRequired,
  state: PropTypes.object,
  innerRef: PropTypes.func,
  disabled: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

MemoryTabLink.defaultProps = {
  Component: 'div',
};
