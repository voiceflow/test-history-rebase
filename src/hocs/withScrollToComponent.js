import React, { Component } from 'react';
import PropTypes from 'prop-types';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { ScrollContextConsumer } from 'contexts';

import withContextValue from './withContextValue';

export default ({ padding = 0, scrollByProp } = {}) => Wrapper =>
  withContextValue(ScrollContextConsumer)(
    class WithScrollToComponent extends Component {
      static displayName = wrapDisplayName(Wrapper, 'WithScrollToComponent');

      static propTypes = {
        scrollToNode: PropTypes.func.isRequired,
      };

      componentDidMount() {
        if (!this.node || !scrollByProp || !this.props[scrollByProp]) {
          return;
        }

        this.props.scrollToNode(this.node, padding);
      }

      componentDidUpdate(prevProps) {
        if (this.node && scrollByProp && prevProps[scrollByProp] !== this.props[scrollByProp]) {
          requestAnimationFrame(() => this.props.scrollToNode(this.node, padding));
        }
      }

      onRef = component => {
        this.node = component;
      };

      onScrollToComponent = (_padding = padding) => {
        this.props.scrollToNode(this.node, _padding);
      };

      render() {
        return (
          <Wrapper
            onScrollToNodeRef={this.onRef}
            scrollToComponent={this.onScrollToComponent}
            {...this.props}
          />
        );
      }
    }
  );
