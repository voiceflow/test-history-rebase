import React, { Component } from 'react';
import PropTypes from 'prop-types';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { ScrollContextConsumer } from 'contexts';

import withContextValue from './withContextValue';

export default ({ fixOnDidMount, fixOnDidUpdate } = {}) => Wrapper =>
  withContextValue(ScrollContextConsumer)(
    class WithScrollBarOffsetUpdater extends Component {
      static displayName = wrapDisplayName(Wrapper, 'WithScrollBarOffsetUpdater');

      static propTypes = {
        setScrollBarOffset: PropTypes.func.isRequired,
      };

      componentDidMount() {
        if (fixOnDidMount) {
          this.props.setScrollBarOffset();
        }
      }

      componentDidUpdate() {
        if (fixOnDidUpdate) {
          this.props.setScrollBarOffset();
        }
      }

      render() {
        return <Wrapper {...this.props} setScrollBarOffset={this.props.setScrollBarOffset} />;
      }
    }
  );
