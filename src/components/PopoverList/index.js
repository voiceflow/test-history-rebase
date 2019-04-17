import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';

import Icon from '../Icon';

export default class PopoverList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        icon: PropTypes.string,
        level: PropTypes.number,
        label: PropTypes.string,
        labelNode: PropTypes.node,
        rightIcon: PropTypes.string,
      })
    ),
    noWrap: PropTypes.bool,
    onClick: PropTypes.func,
    notFound: PropTypes.bool,
    selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    textTruncate: PropTypes.bool,
    renderListItem: PropTypes.func,
  };

  static defaultProps = {
    notFound: true,
  };

  state = {
    hovered: false,
  };

  withIcons = memoize(items => items.some(({ icon }) => !!icon));

  withRightIcons = memoize(items => items.some(({ rightIcon }) => !!rightIcon));

  onMouseEnter = () => {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  };

  render() {
    const { hovered } = this.state;
    const {
      items,
      noWrap,
      onClick,
      notFound,
      selectedId,
      textTruncate,
      renderListItem,
    } = this.props;

    if (!items.length) {
      return (
        notFound && (
          <ul className="popover-list">
            <li className="popover-list__list-item">
              <p
                style={{
                  // FIXME: Move to css
                  pointerEvents: 'none',
                  backgroundImage: 'none',
                  backgroundColor: 'transparent',
                }}
                className={cn('popover-list__item text-muted', { 'text-nowrap': noWrap })}
              >
                No results found
              </p>
            </li>
          </ul>
        )
      );
    }

    return (
      <ul
        className={cn('popover-list', {
          '__with-icons': this.withIcons(items),
          '__with-right-icons': this.withRightIcons(items),
        })}
      >
        {items.map(item => {
          const { id, icon, level, label, rightIcon, labelNode } = item;
          const isActive = id === selectedId;

          const childProps = {};

          if (labelNode) {
            childProps.children = labelNode;
          } else {
            const text = level === 1 ? <strong>{label}</strong> : label;

            childProps.children = (
              <Fragment>
                {!!icon && <Icon className={cn(icon, { '__text-position': !!text })} />}
                {textTruncate ? <div className="text-truncate">{text}</div> : text}
                {!!rightIcon && <Icon className={cn(rightIcon, { '__text-position': !!text })} />}
              </Fragment>
            );
          }

          return (
            <li
              key={id}
              onClick={() => onClick && onClick(item)}
              className={cn('popover-list__list-item', {
                'text-nowrap': noWrap,
                [`__${level}-level`]: level,
              })}
            >
              {renderListItem ? (
                renderListItem(item, childProps)
              ) : (
                <div
                  className={cn('popover-list__item', { '__is-active': !hovered && isActive })}
                  onMouseEnter={() => !isActive && this.onMouseEnter()}
                  {...childProps}
                />
              )}
            </li>
          );
        })}
      </ul>
    );
  }
}
