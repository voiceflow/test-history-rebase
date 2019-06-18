import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import Button from '../Button';
import Popover from '../Popover';
import PopoverList from '../PopoverList';
import Selectable from '../Selectable';

export default class Select extends Component {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        level: PropTypes.number,
        label: PropTypes.string,
      })
    ).isRequired,
    disabled: PropTypes.bool,
    formLabel: PropTypes.string,
    customLabel: PropTypes.string,
    buttonProps: PropTypes.object,
    textTruncate: PropTypes.bool,
    setMaxOptionWidth: PropTypes.bool,
  };

  static defaultProps = {
    buttonProps: {},
  };

  popoverRenderer = ({ value, onSelect, ...popoverProps }) => {
    return (
      <Popover
        gap={1}
        isList
        strategy="bottom left"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        setMinWidth
        {...popoverProps}
        renderBody={() => this.renderBody({ value, onSelect })}
      />
    );
  };

  renderBody = ({ value, onSelect }) => {
    const { options, textTruncate } = this.props;

    return <PopoverList items={options} onClick={onSelect} selectedId={value} textTruncate={textTruncate} />;
  };

  render() {
    const { label, options, children, disabled, formLabel, buttonProps, customLabel, setMaxOptionWidth, ...selectableProps } = this.props;

    return (
      <Fragment>
        {!!formLabel && <label className="form-label">{formLabel}</label>}

        <Selectable {...selectableProps} popoverRenderer={this.popoverRenderer}>
          {children ||
            (({ show, value, onRef, opened }) => {
              const option = customLabel || options.find(({ id }) => id === value);

              return (
                <Button
                  isSimple
                  disabled={disabled}
                  isActive={opened}
                  className={cn('text-left', buttonProps.className)}
                  isDropdown
                  {...buttonProps}
                  onRef={onRef}
                  onClick={() => !disabled && show()}
                >
                  <div className="filter-item">
                    {!!label && <div className="filter-item__label">{label}</div>}
                    <div className="filter-item__value">{customLabel || (option ? option.title || option.label : 'Please select an option')}</div>
                  </div>

                  {setMaxOptionWidth &&
                    options.map((opt) => (
                      <div key={opt.id} className="filter-item h-h-0">
                        {!!label && <div className="filter-item__label">{label}</div>}
                        <div className="filter-item__value">{opt.title || opt.label}</div>
                      </div>
                    ))}
                </Button>
              );
            })}
        </Selectable>
      </Fragment>
    );
  }
}
