import React, { Component } from 'react';
import toLower from 'lodash/toLower';
import PropTypes from 'prop-types';

import Popover from '../Popover';
import PopoverList from '../PopoverList';
import Autocompletable from '../Autocompletable';

export default class Autocomplete extends Component {
  static propTypes = {
    value: PropTypes.any,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        level: PropTypes.number,
        label: PropTypes.string,
      })
    ),
    isInline: PropTypes.bool,
    textTruncate: PropTypes.bool,
    filteredLabel: PropTypes.string,
    disableSorting: PropTypes.bool,
    withCustomInput: PropTypes.bool,
    withCustomValue: PropTypes.bool,
    popoverRenderer: PropTypes.func,
    removeSelectedValue: PropTypes.bool,
  };

  static defaultProps = {
    options: [],
    isInline: false,
    textTruncate: true,
    filteredLabel: '',
    disableSorting: false,
  };

  state = {
    opened: false,
  };

  onShow = e => {
    const { onShow } = this.props;

    onShow && onShow(e);
    this.setState({ opened: true });
  };

  onHide = e => {
    const { onHide } = this.props;

    onHide && onHide(e);
    this.setState({ opened: false });
  };

  getFilteredOptions(value, filteredLabel) {
    const { options, disableSorting, removeSelectedValue } = this.props;
    const lowerCaseFilteredLabel = toLower(filteredLabel);

    if (filteredLabel) {
      const filteredOptions = options.filter(
        option =>
          (!value || (removeSelectedValue ? value !== option.id : true)) &&
          toLower(option.label).includes(lowerCaseFilteredLabel)
      );

      if (!disableSorting) {
        filteredOptions.sort(
          (l, r) =>
            toLower(l.label).indexOf(lowerCaseFilteredLabel) -
            toLower(r.label).indexOf(lowerCaseFilteredLabel)
        );
      }

      return filteredOptions;
    }

    return options;
  }

  rendererPopover = ({ value, onSelect, filteredLabel, ...popoverProps }) => {
    const { isInline, popoverRenderer } = this.props;

    const filteredOptions = this.getFilteredOptions(value, filteredLabel);

    return popoverRenderer ? (
      popoverRenderer({ value, onSelect, filteredLabel, filteredOptions, ...popoverProps })
    ) : (
      <Popover
        gap={isInline ? 2 : 0}
        isList
        strategy="bottom center"
        sameWidth={!isInline}
        {...popoverProps}
        renderBody={() => this.renderBody({ value, onSelect, filteredLabel, filteredOptions })}
      />
    );
  };

  renderBody = ({ value, onSelect, filteredOptions }) => {
    const { textTruncate, withCustomValue } = this.props;

    return (
      <PopoverList
        items={filteredOptions}
        noWrap
        onClick={onSelect}
        notFound={!withCustomValue}
        selectedId={value}
        textTruncate={textTruncate}
      />
    );
  };

  render() {
    const { opened } = this.state;
    const {
      value,
      options,
      filteredLabel,
      withCustomValue,
      withCustomInput,
      removeSelectedValue,
      ...autocompletableProps
    } = this.props;

    const option = options && options.find(({ id }) => id === value);

    return (
      <Autocompletable
        {...autocompletableProps}
        value={value}
        onShow={this.onShow}
        onHide={this.onHide}
        filteredLabel={
          withCustomInput && opened
            ? filteredLabel
            : option
            ? option.label
            : (withCustomValue && value) || ''
        }
        popoverRenderer={this.rendererPopover}
        filteredPrevLevelLabel={!withCustomValue && option ? option.preLevelLabel : ''}
      />
    );
  }
}
