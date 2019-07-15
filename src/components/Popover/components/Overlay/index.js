/* eslint-disable no-underscore-dangle */
import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import { RootCloseWrapper } from 'react-overlays';

import { findClosestNode } from '@/utils/dom';
import { createStrategyFromFunction, strategies } from '@/utils/position';

import Transition from '../../../Transition';

export default class Overlay extends Component {
  static propTypes = {
    gap: PropTypes.number,
    show: PropTypes.bool,
    style: PropTypes.object, // FIXME: Move to css
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    target: PropTypes.object,
    strategy: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    sameWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    setMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    scrollContainers: PropTypes.array.isRequired,
    repositionOnUpdate: PropTypes.bool,
    disableOutsideClose: PropTypes.bool,
  };

  static defaultProps = {
    repositionOnUpdate: true,
  };

  static isDropdown = (node) => node.classList && node.classList.contains('__type-dropdown');

  scrollContainersListeners = {};

  componentDidMount() {
    const { onShow, scrollContainers } = this.props;

    this.addListeners(scrollContainers);
    this.onReposition();

    onShow && onShow(this.me);
  }

  componentDidUpdate(prevProps) {
    const { scrollContainers, repositionOnUpdate } = this.props;

    if (prevProps.scrollContainers !== scrollContainers) {
      this.removeListeners(prevProps.scrollContainers);
      this.addListeners(scrollContainers);
    }

    if (repositionOnUpdate) {
      this.onReposition();
    }
  }

  componentWillUnmount() {
    const { scrollContainers } = this.props;

    this.unmounted = true;

    cancelAnimationFrame(this.repositionAnimationFrame);

    this.removeListeners(scrollContainers);
  }

  onRootRef = (node) => {
    this.me = node;
  };

  onRootClose = (e) => {
    if (e._processed) {
      return;
    }

    const { onHide } = this.props;

    // eslint-disable-next-line react/no-find-dom-node
    const me = findDOMNode(this.me);
    const popover = findClosestNode(e.target, 'popover');

    // hide only the closest to the target popover
    if (!popover || popover === me || Overlay.isDropdown(me)) {
      onHide(e);
      // using custom attribute is easier than dealing with event bubbling, listener order and all that stuff.
      e._processed = true;
    }
  };

  onReposition = (index = 0) => {
    this.repositionAnimationFrame = requestAnimationFrame(() => {
      if (this.unmounted) {
        return true;
      }

      const { gap, target, onHide, strategy, sameWidth, setMinWidth, scrollContainers } = this.props;

      // eslint-disable-next-line react/no-find-dom-node
      const parent = findDOMNode(target);
      // eslint-disable-next-line react/no-find-dom-node
      const child = findDOMNode(this.popoverOverlay);

      if (parent && child) {
        const _index = typeof index === 'number' ? index : 0;
        const parentSizes = parent.getBoundingClientRect();
        const scrollContainerSizes = scrollContainers[_index].getBoundingClientRect();

        let _strategy;

        if (typeof strategy === 'function') {
          _strategy = createStrategyFromFunction(strategy);
        }

        if (typeof strategy === 'string') {
          _strategy = strategies[strategy];
        }

        if (
          scrollContainerSizes.top <= parentSizes.top + parentSizes.height &&
          scrollContainerSizes.bottom >= parentSizes.bottom - parentSizes.height &&
          scrollContainerSizes.left <= parentSizes.left + parentSizes.width &&
          scrollContainerSizes.right >= parentSizes.right - parentSizes.width
        ) {
          if (setMinWidth) {
            const childWidth = typeof setMinWidth === 'boolean' ? Math.round(parentSizes.width) : +setMinWidth;

            child.style.minWidth = `${childWidth}px`;
          }

          if (sameWidth) {
            const childWidth = typeof sameWidth === 'boolean' ? Math.round(parentSizes.width) : +sameWidth;

            child.style.width = `${childWidth}px`;
          }

          _strategy(parent, child, { gap: gap || 0 });

          // const bottomOffset = parseInt(window.getComputedStyle(child).getPropertyValue('margin-bottom'), 10);
          // const top = parseInt(window.getComputedStyle(child).getPropertyValue('top'), 10);

          // child.style.maxHeight = top !== null ? `calc(100% - ${top + bottomOffset}px)` : '';
        } else {
          onHide();
        }
      }
    });
  };

  addListeners(scrollContainers) {
    window.addEventListener('resize', this.onReposition);

    scrollContainers.forEach((container, i) => {
      this.scrollContainersListeners[i] = () => this.onReposition(i);

      container.addEventListener('scroll', this.scrollContainersListeners[i]);
    });
  }

  removeListeners(scrollContainers) {
    window.removeEventListener('resize', this.onReposition);

    scrollContainers.forEach((container, i) => container.removeEventListener('scroll', this.scrollContainersListeners[i]));

    this.scrollContainersListeners = {};
  }

  render() {
    const { show, style, strategy = '', children, className, disableOutsideClose } = this.props;
    const strategies = strategy.split(' ').map((s) => `__strategy-${s}`);

    const body = (
      <Transition
        name="fade-scale-y"
        style={style}
        timeout={150}
        className={cn(className, strategies)}
        wrapperProps={{
          ref: (node) => {
            this.popoverOverlay = node;
          },
          onClick: (e) => e.stopPropagation(),
        }}
      >
        {children}
      </Transition>
    );

    return createPortal(
      <RootCloseWrapper ref={this.onRootRef} disabled={!show || disableOutsideClose} onRootClose={this.onRootClose}>
        {body}
      </RootCloseWrapper>,
      document.querySelector('#root')
    );
  }
}
