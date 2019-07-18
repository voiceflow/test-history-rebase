/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createPortal, findDOMNode } from 'react-dom';

import { createStrategyFromFunction, strategies } from '@/utils/position';

import Transition from '../../../Transition';

export default class Overlay extends Component {
  static propTypes = {
    gap: PropTypes.number,
    target: PropTypes.object,
    strategy: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    onChangeStrategy: PropTypes.func,
    scrollContainer: PropTypes.object.isRequired,
  };

  static defaultProps = {
    gap: 8,
  };

  componentDidMount() {
    this.onReposition();

    this.props.scrollContainer.addEventListener('scroll', this.onReposition);

    window.addEventListener('resize', this.onReposition);
  }

  componentDidUpdate() {
    this.onReposition();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.repositionAnimationFrame);

    this.props.scrollContainer.removeEventListener('scroll', this.onReposition);

    window.removeEventListener('resize', this.onReposition);
  }

  onReposition = () => {
    this.repositionAnimationFrame = requestAnimationFrame(() => {
      /* eslint-disable react/no-find-dom-node */
      const child = findDOMNode(this.popoverOverlay);
      const parent = findDOMNode(this.props.target);
      /* eslint-enable react/no-find-dom-node */

      if (parent && child) {
        const { strategy, gap } = this.props;

        let _strategy;

        if (typeof strategy === 'function') {
          _strategy = createStrategyFromFunction(strategy);
        }

        if (typeof strategy === 'string') {
          _strategy = strategies[strategy];
        }

        _strategy(parent, child, { gap: gap || 0 });

        this.checkStrategy(parent, child);
      }
    });
  };

  checkStrategy(parent, child) {
    const { strategy, onChangeStrategy } = this.props;
    const target = parent.getBoundingClientRect();
    const tooltip = child.getBoundingClientRect();

    switch (strategy) {
      case 'top': {
        if (tooltip.top > target.top) {
          onChangeStrategy('bottom');
        }
        break;
      }
      case 'bottom': {
        if (tooltip.bottom < target.bottom) {
          onChangeStrategy('top');
        }
        break;
      }
      case 'left': {
        if (tooltip.left > target.left) {
          onChangeStrategy('right');
        }
        break;
      }
      case 'right': {
        if (tooltip.right < target.right) {
          onChangeStrategy('left');
        }
        break;
      }
      default:
    }
  }

  render() {
    const { className, children } = this.props;

    return createPortal(
      <Transition
        name="fade-up-small"
        timeout={150}
        className={className}
        wrapperProps={{
          ref: (r) => {
            this.popoverOverlay = r;
          },
        }}
      >
        {children}
      </Transition>,
      document.querySelector('#root')
    );
  }
}
