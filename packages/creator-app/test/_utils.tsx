import { Utils } from '@voiceflow/common';
import React from 'react';
import { ReactReduxContext } from 'react-redux';
import { ThemeContext } from 'styled-components';

import theme from '../src/styles/theme';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const store = {
    getState: () => ({}),
    dispatch: Utils.functional.noop,
    subscribe: () => Utils.functional.noop,
    replaceReducer: Utils.functional.noop,
  } as any;

  return <ReactReduxContext.Provider value={{ store, storeState: {} }}>{children}</ReactReduxContext.Provider>;
};

export const composeWrappers =
  (...wrappers: React.FC<React.PropsWithChildren>[]): React.FC<React.PropsWithChildren> =>
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
