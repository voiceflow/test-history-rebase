import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { ThemeContext } from 'styled-components';

import { noop } from '@/utils/functional';

import theme from '../src/styles/theme';

export const ThemeProvider: React.FC = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const StoreProvider: React.FC = ({ children }) => {
  return (
    <ReactReduxContext.Provider
      value={{
        store: {
          getState: () => ({}),
          subscribe: () => noop,
          dispatch: noop,
          replaceReducer: noop,
        } as any,
        storeState: {},
      }}
    >
      {children}
    </ReactReduxContext.Provider>
  );
};

export const composeWrappers =
  (...wrappers: React.FC[]): React.FC =>
  ({ children }) => {
    if (!wrappers.length) return <>{children}</>;

    const [OuterWrapper, ...rest] = wrappers;
    const InnerWrapper = composeWrappers(...rest);

    return (
      <OuterWrapper>
        <InnerWrapper>{children}</InnerWrapper>
      </OuterWrapper>
    );
  };
