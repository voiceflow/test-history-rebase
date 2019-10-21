import cn from 'classnames';
import memoize from 'memoize-one';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SvgIcon from '@/components/SvgIcon';

import { PopoverListItem, PopoverListNoItem, PopoverListWrapper } from './styled';

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

  withIcons = memoize((items) => items.some(({ icon }) => !!icon));

  withRightIcons = memoize((items) => items.some(({ rightIcon }) => !!rightIcon));

  onMouseEnter = () => {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  };

  render() {
    const { hovered } = this.state;
    const { items, noWrap, onClick, notFound, selectedId, textTruncate, renderListItem } = this.props;

    if (!items.length) {
      return (
        notFound && (
          <PopoverListWrapper>
            <li>
              <PopoverListNoItem>No results found</PopoverListNoItem>
            </li>
          </PopoverListWrapper>
        )
      );
    }

    return (
      <PopoverListWrapper>
        {items.map((item) => {
          const { id, icon, level, label, rightIcon, labelNode } = item;
          const isActive = id === selectedId;

          const childProps = {};

          if (labelNode) {
            childProps.children = labelNode;
          } else {
            const text = level === 1 ? <strong>{label}</strong> : label;

            childProps.children = (
              <>
                {!!icon && <SvgIcon icon={icon} />}
                {textTruncate ? <div className="text-truncate">{text}</div> : text}
                {!!rightIcon && <SvgIcon icon={rightIcon} />}
              </>
            );
          }

          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={id}
              onClick={() => onClick && onClick(item)}
              className={cn({
                'text-nowrap': noWrap,
                [`__${level}-level`]: level,
              })}
            >
              {renderListItem ? (
                renderListItem(item, childProps)
              ) : (
                <PopoverListItem active={!hovered && !isActive} onMouseEnter={() => !isActive && this.onMouseEnter()} {...childProps} />
              )}
            </li>
          );
        })}
      </PopoverListWrapper>
    );
  }
}
