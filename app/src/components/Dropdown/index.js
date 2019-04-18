import React, { Component } from 'react';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';

import Button from '../Button';
import Popover from '../Popover';
import Selectable from '../Selectable';
import PopoverList from '../PopoverList';

export default class Dropdown extends Component {
  static propTypes = {
    label: PropTypes.node,
    options: PropTypes.array.isRequired,
    children: PropTypes.func,
    onSelect: PropTypes.func,
    selectedId: PropTypes.string,
    buttonProps: PropTypes.object,
    popoverProps: PropTypes.object,
  };

  static defaultProps = {
    buttonProps: {},
    popoverProps: {},
  };

  static getLabelById(options = [], _id) {
    const option = options.find(({ id }) => id === _id);

    return option && option.label;
  }

  onSelect = ({ id }) => {
    const callbackName = camelCase(`on-${id}`);

    const { onSelect, [callbackName]: callback } = this.props;

    callback && callback();
    onSelect && onSelect(id);
  };

  popoverBodyRenderer = ({ onSelect }) => {
    const { options, selectedId } = this.props;

    return <PopoverList items={options} onClick={onSelect} selectedId={selectedId} />;
  };

  popoverRenderer = ({ onSelect, ...popoverProps }) => {
    return (
      <Popover
        gap={1}
        isList
        strategy="bottom left"
        {...popoverProps}
        renderBody={() => this.popoverBodyRenderer({ onSelect })}
      />
    );
  };

  render() {
    const { label, children, popoverProps, buttonProps } = this.props;

    return (
      <Selectable {...popoverProps} onSelect={this.onSelect} popoverRenderer={this.popoverRenderer}>
        {children ||
          (({ show, onRef, opened }) => (
            <Button ref={onRef} onClick={show} isActive={opened} isDropdown {...buttonProps}>
              {label}
            </Button>
          ))}
      </Selectable>
    );
  }
}
