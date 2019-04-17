import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ScrollContextProvider } from 'contexts';
import { scrollTo, getOffsetToNode, setScrollbarOffset } from 'utils/dom';

import Transition from '../Transition';

import Overlay from './components/Overlay';

export default class Modal extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    back: PropTypes.bool,
    isPage: PropTypes.bool,
    onBack: PropTypes.func,
    onHide: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    renderBody: PropTypes.func,
    renderSearch: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    bodyClassName: PropTypes.string,
    exitAnimation: PropTypes.bool,
    enterAnimation: PropTypes.bool,
    enableScrollbarOffset: PropTypes.bool,
    updateScrollbarOffsetOnUpdate: PropTypes.bool,
  };

  static defaultProps = {
    exitAnimation: true,
    enterAnimation: true,
  };

  state = {
    searchSticky: false,
  };

  searchStickyAdded = false;

  constructor(props) {
    super(props);

    this.scrollContextValue = {
      scrollToNode: this.scrollToNode,
      setScrollBarOffset: this.setScrollBarOffset,
    };
  }

  componentDidUpdate() {
    const { updateScrollbarOffsetOnUpdate } = this.props;

    if (updateScrollbarOffsetOnUpdate) {
      this.setScrollBarOffset();
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.scrollAnimationFrame);
  }

  onRef = node => {
    this.body = node;
  };

  onBodyInnerRef = node => {
    this.bodyInner = node;
  };

  onScroll = ({ target: { scrollTop } }) => {
    this.scrollAnimationFrame = requestAnimationFrame(() => {
      if (scrollTop && !this.classStickyAdded) {
        this.classStickyAdded = true;
        this.setState({ searchSticky: true });
      } else if (!scrollTop && this.classStickyAdded) {
        this.classStickyAdded = false;
        this.setState({ searchSticky: false });
      }
    });
  };

  scrollToNode = (node, padding) => {
    const curTop = getOffsetToNode(node, this.body);

    scrollTo(this.body, { top: curTop - padding });
  };

  setScrollBarOffset = () => {
    const { enableScrollbarOffset } = this.props;

    if (enableScrollbarOffset) {
      requestAnimationFrame(() => setScrollbarOffset(this.body, this.bodyInner));
    }
  };

  render() {
    const { searchSticky } = this.state;
    const {
      show,
      back,
      onHide,
      isPage,
      onBack,
      isSmall,
      disabled,
      className,
      renderBody,
      withBigIcon,
      isFullscreen,
      renderSearch,
      renderHeader,
      renderFooter,
      bodyClassName,
      exitAnimation,
      enterAnimation,
    } = this.props;

    const modalClassName = cn('modal', className, {
      '__w-392': withBigIcon,
      '__w-484': isSmall,
      '__is-active': (!exitAnimation && show) || (!enterAnimation && show) || true,
      '__type-fullscreen': isFullscreen,
    });

    return (
      <ScrollContextProvider value={this.scrollContextValue}>
        <Transition
          in={show}
          node={!!isFullscreen}
          name="fade-up"
          exit={exitAnimation}
          enter={enterAnimation}
          appear={enterAnimation}
          component={Overlay}
          className={modalClassName}
          wrapperProps={{
            show,
            isPage,
            onHide,
            disabled,
            isFullscreen,
          }}
          mountOnEnter
          unmountOnExit
        >
          <Fragment>
            {renderHeader && (
              <div className="modal-header">
                {back && (
                  <button className="modal-back" onClick={onBack}>
                    Back
                  </button>
                )}
                {renderHeader()}
                <button onClick={onHide} className="modal-close">
                  Close
                </button>
              </div>
            )}

            {renderSearch && (
              <div
                className={cn('modal-search', {
                  '__is-sticky': searchSticky,
                })}
              >
                {renderSearch()}
              </div>
            )}

            {renderBody && (
              <div
                ref={this.onRef}
                onScroll={renderSearch ? this.onScroll : undefined}
                className={cn('modal-body', bodyClassName)}
              >
                <div ref={this.onBodyInnerRef} className="modal-body-inner">
                  {renderBody()}
                </div>
              </div>
            )}
            {renderFooter && <div className="modal-footer">{renderFooter()}</div>}
          </Fragment>
        </Transition>
      </ScrollContextProvider>
    );
  }
}
