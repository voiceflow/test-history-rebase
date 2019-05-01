import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import { findScrollableParents } from 'utils/dom';

import Input from '../Input';
import Transition from '../Transition';

import Tabs from './components/Tabs';
import Overlay from './components/Overlay';

export default class Popover extends Component {
  static propTypes = {
    gap: PropTypes.number,
    show: PropTypes.bool,
    tabs: PropTypes.array,
    style: PropTypes.object,
    title: PropTypes.string,
    isText: PropTypes.bool,
    isList: PropTypes.bool,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    target: PropTypes.object,
    onClick: PropTypes.func,
    strategy: PropTypes.string,
    activeTab: PropTypes.string,
    className: PropTypes.string,
    sameWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    renderBody: PropTypes.func,
    withSearch: PropTypes.bool,
    searchText: PropTypes.string,
    setMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    onChangeTab: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onFooterClick: PropTypes.func,
    tabsClassName: PropTypes.string,
    onSearchChange: PropTypes.func,
    searchClassName: PropTypes.string,
    footerClassName: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    disableOutsideClose: PropTypes.bool,
    footerWithoutBorder: PropTypes.bool,
  };

  static defaultProps = {
    onClick: () => null,
    strategy: 'bottom center',
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (!state || !state.prevTarget || state.prevTarget !== props.target) {
      return {
        prevTarget: props.target,
        scrollContainers: props.target ? findScrollableParents(findDOMNode(props.target)) : [],
      };
    }

    return null;
  }

  state = {
    scrollContainers: [],
  };

  onShow = ref => {
    const { onShow, autoFocus } = this.props;

    onShow && onShow();

    if (autoFocus && ref) {
      const focusable = findDOMNode(ref).querySelector(
        'input:not([type="radio"]):not([type="checkbox"])'
      );

      focusable && focusable.focus && focusable.focus();
    }
  };

  onFooterClick = () => {
    const { onHide, onFooterClick } = this.props;

    onFooterClick();
    onHide();
  };

  render() {
    const { scrollContainers } = this.state;
    const {
      show,
      tabs,
      title,
      onHide,
      isList,
      isText,
      onShow,
      onClick,
      activeTab,
      className,
      autoFocus,
      withSearch,
      searchText,
      renderBody,
      onChangeTab,
      renderFooter,
      renderHeader,
      tabsClassName,
      onFooterClick,
      onSearchChange,
      searchClassName,
      isNotifications,
      footerClassName,
      searchPlaceholder,
      footerWithoutBorder,
      ...overlayProps
    } = this.props;

    if (!show || !overlayProps.target) {
      return null;
    }

    const popoverClassName = cn('popover', className, {
      '__is-active': show,
      '__type-list': isList,
      '__type-text': isText,
      '__type-notifications': isNotifications,
    });

    return (
      <Overlay
        show={show}
        onHide={onHide}
        onShow={this.onShow}
        className={popoverClassName}
        scrollContainers={scrollContainers}
        {...overlayProps}
      >
        {renderHeader && !title && <div className="popover-header">{renderHeader({ onHide })}</div>}

        {title && !renderHeader && (
          <Transition name="fade-up-small" delay={150} className="popover-header">
            <div className="popover-header__title">{title()}</div>
          </Transition>
        )}

        {!!withSearch && (
          <Transition
            name="fade-up-small"
            delay={150}
            className={cn('popover-search', searchClassName)}
          >
            <Input
              icon="search"
              value={searchText}
              action={searchText ? 'close-regular' : null}
              onChange={({ target }) => onSearchChange(target.value)}
              autoFocus
              placeholder={searchPlaceholder}
              onActionClick={() => onSearchChange('')}
            />
          </Transition>
        )}

        {!!tabs && (
          <Transition
            name="fade-up-small"
            delay={150}
            className={cn('popover-tabs', tabsClassName)}
          >
            <Tabs list={tabs} active={activeTab} onChange={onChangeTab} />
          </Transition>
        )}

        {renderBody && (
          <Transition
            name="fade-up-small"
            delay={150}
            wrapperProps={{ onClick }}
          >
            <div className="popover-body-inner">{renderBody({ onHide })}</div>
          </Transition>
        )}

        {renderFooter && (
          <Transition
            name="fade-up-small"
            delay={150}
            className={cn('popover-footer', footerClassName, {
              'text-link': onFooterClick,
              '__without-border': footerWithoutBorder,
            })}
            wrapperProps={{ onClick: onFooterClick ? this.onFooterClick : null }}
          >
            {renderFooter({ onHide })}
          </Transition>
        )}
      </Overlay>
    );
  }
}
