import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Input from '../Input';
import Selectable from '../Selectable';
import GroupFormInline from '../GroupFormInline';

import ControlItem from './components/ControlItem';

export default class Autocompletable extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.any,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    isInline: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    leftAddon: PropTypes.node,
    blurOnHide: PropTypes.bool,
    rightAddon: PropTypes.node,
    isClearable: PropTypes.bool,
    placeholder: PropTypes.string,
    filteredLabel: PropTypes.string,
    inputClassName: PropTypes.string,
    popoverRenderer: PropTypes.func.isRequired,
    leftAddonClassName: PropTypes.string,
    filteredPrevLevelLabel: PropTypes.string,
    rightAddonAddonClassName: PropTypes.string,
  };

  static defaultProps = {
    autoFocus: true,
    filteredLabel: '',
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (!state || props.filteredLabel !== state.propFilteredLabel) {
      return {
        filteredLabel: props.filteredLabel,
        propFilteredLabel: props.filteredLabel,
      };
    }

    return null;
  }

  static stopImmediatePropagation(e) {
    e.nativeEvent.stopImmediatePropagation && e.nativeEvent.stopImmediatePropagation();
  }

  state = {
    filteredLabel: this.props.filteredLabel,
  };

  componentWillUnmount() {
    clearTimeout(this.forceHideTimeout);
  }

  onClear = e => {
    const { onSelect } = this.props;

    Autocompletable.stopImmediatePropagation(e);

    onSelect && onSelect({ id: null });
    this.setState({ filteredLabel: '' });
  };

  onHide = e => {
    const { onHide, filteredLabel } = this.props;

    this.setState({ filteredLabel });

    clearTimeout(this.forceHideTimeout);

    onHide && onHide(e);
  };

  onShow = e => {
    const { onShow } = this.props;

    this.setState({ filteredLabel: '' });

    onShow && onShow(e);
  };

  onChange = e => {
    const { onChange } = this.props;

    onChange && onChange(e);

    this.setState({ filteredLabel: e.target.value });
  };

  onKeyDown = (e, hide) => {
    if (e.keyCode === 9) {
      hide();
    }
  };

  render() {
    const { filteredLabel } = this.state;
    const {
      icon,
      style,
      label,
      error,
      isInline,
      disabled,
      readOnly,
      leftAddon,
      autoFocus,
      rightAddon,
      blurOnHide,
      isClearable,
      placeholder,
      inputClassName,
      popoverRenderer,
      leftAddonClassName,
      rightAddonClassName,
      filteredPrevLevelLabel,
      ...selectableProps
    } = this.props;

    if (readOnly) {
      return filteredLabel ? (
        <GroupFormInline
          cols={[
            !!icon && { content: <Icon className={icon} textPosition /> },
            {
              content: <ControlItem label={filteredPrevLevelLabel} value={filteredLabel} />,
              className: '__is-stretched',
            },
          ]}
          className="__size-sm __nowrap"
        />
      ) : null;
    }

    return (
      <Selectable
        {...selectableProps}
        onHide={this.onHide}
        onShow={this.onShow}
        popoverRenderer={props => popoverRenderer({ ...props, filteredLabel })}
      >
        {({ show, hide, value, onRef, opened }) => {
          let inlineStyles = {};
          const isShowLabelWithLevel = !opened && !!filteredLabel && !!filteredPrevLevelLabel;
          const isShowRightAddon = !!rightAddon || (isClearable && !!filteredLabel);

          if (isInline) {
            // FIXME: Move to css
            inlineStyles = {
              style: {
                textAlign: 'center',
                boxShadow: 'none',
                borderColor: opened ? '#4666ea' : 'transparent',
                padding: '0',
              },
              inputStyle: {
                textAlign: 'center',
                boxShadow: 'none',
                borderWidth: 0,
                borderColor: 'transparent',
                paddingRight: '37px',
              },
            };
          }

          return (
            <Fragment>
              {!!label && <label className="form-label">{label}</label>}

              <div
                style={isInline ? { display: 'inline-flex' } : undefined} // FIXME: Move to css
                className={cn('form-control-dropdown', {
                  '__is-inline': isInline,
                  '__is-disabled': disabled,
                  '__is-clearable': isShowRightAddon,
                })}
              >
                {!!icon && (
                  <div
                    style={{ zIndex: 1 }} // FIXME: Move to css
                    className={cn('form-control-dropdown__addon', { '__is-active': !!value })}
                  >
                    <Icon className={icon} />
                  </div>
                )}

                {!!leftAddon && (
                  <div className={cn('form-control-group__addon', leftAddonClassName)}>
                    {leftAddon}
                  </div>
                )}

                {isShowLabelWithLevel && (
                  <div
                    style={{ position: 'absolute', top: 0, pointerEvents: 'none' }} // FIXME: Move to css
                    className="form-control"
                  >
                    <ControlItem label={filteredPrevLevelLabel} value={filteredLabel} />
                  </div>
                )}

                <Input
                  {...inlineStyles}
                  key={blurOnHide ? opened : null}
                  error={error}
                  onRef={onRef}
                  value={filteredLabel}
                  onBlur={this.onBlur}
                  onFocus={show}
                  onClick={e => opened && Autocompletable.stopImmediatePropagation(e)}
                  disabled={disabled}
                  autoSize={isInline}
                  onChange={this.onChange}
                  autoFocus={autoFocus && opened}
                  onKeyDown={e => this.onKeyDown(e, hide)}
                  wrapInput={false}
                  className={cn('text-truncate', inputClassName, {
                    'h-o-0': isShowLabelWithLevel,
                    '__is-inline': isInline,
                  })}
                  onMouseDown={() => !opened && show()}
                  placeholder={placeholder || filteredLabel}
                  withoutErrorText
                />

                {isShowRightAddon &&
                  (rightAddon ? (
                    <div className={cn('form-control-group__addon', rightAddonClassName)}>
                      {rightAddon}
                    </div>
                  ) : (
                    <div
                      onClick={this.onClear}
                      className="form-control-dropdown__addon __type-clear"
                    >
                      <Icon className="close-regular" />
                    </div>
                  ))}
              </div>

              {error && <small className="form-hint text-danger">{error}</small>}
            </Fragment>
          );
        }}
      </Selectable>
    );
  }
}
