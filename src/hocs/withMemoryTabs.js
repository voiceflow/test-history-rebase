import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { MemoryTabsContextProvider } from 'contexts';

export default ({
  withRedux,
  defaultTab = '',
  setActiveTabInRedux,
  getActiveTabFromRedux,
  setActiveTabStateInRedux,
} = {}) => Wrapper =>
  class WithMemoryTabs extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithMemoryTabs');

    constructor(props) {
      super(props);

      this.state = {
        activeTab: defaultTab,
        activeTabState: {},
        onChangeActiveTab: this.onChangeActiveTab,
        onChangeActiveTabState: this.onChangeActiveTabState,
      };

      this.reduxProvidedValue = {
        activeTab: '',
        activeTabState: {},
        onChangeActiveTab: this.onChangeActiveTab,
        onChangeActiveTabState: this.onChangeActiveTabState,
      };
    }

    onChangeActiveTab = (activeTab = '', activeTabState = {}) => {
      if (withRedux) {
        setActiveTabInRedux(activeTab, activeTabState, this.props);
        return;
      }

      this.setState({ activeTab, activeTabState });
    };

    onChangeActiveTabState = (activeTabState = {}) => {
      if (withRedux) {
        setActiveTabStateInRedux(activeTabState, this.props);
        return;
      }

      this.setState({ activeTabState });
    };

    getActiveTabAndState() {
      if (!withRedux) {
        return this.state;
      }

      const { activeTab, activeTabState } = getActiveTabFromRedux(this.props);

      if (
        this.reduxProvidedValue.activeTab !== activeTab ||
        this.reduxProvidedValue.activeTabState !== activeTabState
      ) {
        Object.assign(this.reduxProvidedValue, { activeTab, activeTabState });
      }

      return this.reduxProvidedValue;
    }

    render() {
      const providedValue = this.getActiveTabAndState();

      return (
        <MemoryTabsContextProvider value={providedValue}>
          <Wrapper
            {...this.props}
            memoryActiveTab={providedValue.activeTab}
            memoryActiveTabState={providedValue.activeTabState}
            onChangeMemoryActiveTab={this.onChangeActiveTab}
            onChangeMemoryActiveTabState={this.onChangeActiveTabState}
          />
        </MemoryTabsContextProvider>
      );
    }
  };
