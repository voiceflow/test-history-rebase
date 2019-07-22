import cn from 'classnames';
import memoize from 'memoize-one';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import AutoSizeInput from 'react-input-autosize';
import Textarea from 'react-textarea-autosize';

import Counter from '../Counter';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Loader from '../Loader';
import { validateInteger, validateNumber } from './validations';

export default class Input extends Component {
  static propTypes = {
    id: PropTypes.string,
    max: PropTypes.number,
    type: PropTypes.string,
    icon: PropTypes.string,
    hint: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    onRef: PropTypes.func,
    loader: PropTypes.bool,
    action: PropTypes.string,
    onBlur: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    selected: PropTypes.bool,
    formType: PropTypes.string,
    autoSize: PropTypes.bool,
    children: PropTypes.func,
    readOnly: PropTypes.bool,
    isActive: PropTypes.bool,
    onChange: PropTypes.func,
    dropdown: PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.array,
      selectedId: PropTypes.string,
    }),
    onKeyDown: PropTypes.func,
    wrapInput: PropTypes.bool,
    className: PropTypes.string,
    leftAddon: PropTypes.node,
    rightAddon: PropTypes.node,
    actionText: PropTypes.string,
    onKeyPress: PropTypes.func,
    onValidate: PropTypes.func,
    isHintSmall: PropTypes.bool,
    showCounter: PropTypes.oneOf(['always', 'onFocus']),
    counterProps: PropTypes.object,
    onEnterPress: PropTypes.func,
    onEscapePress: PropTypes.func,
    asideRenderer: PropTypes.func,
    onActionClick: PropTypes.func,
    actionPosition: PropTypes.oneOf(['right', 'left']),
    counterSplitBy: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    actionClassName: PropTypes.string,
    allowShiftEnter: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    withoutErrorText: PropTypes.bool,
    leftAddonClassName: PropTypes.string,
    rightAddonClassName: PropTypes.string,
    controlGroupHeaderRenderer: PropTypes.func,
  };

  static defaultProps = {
    type: 'text',
    value: '',
    wrapInput: true,
    showCounter: 'onFocus',
    counterProps: null,
    actionPosition: 'right',
  };

  static getDropdownProps({ label, options, selectedId, buttonProps = {}, ...props }) {
    // eslint-disable-next-line no-underscore-dangle
    let _label = label;

    if (selectedId) {
      const option = options.find(({ id }) => id === selectedId);

      _label = option ? option.label : '';
    }

    return {
      ...props,
      label: _label,
      options,
      selectedId,
      buttonProps: { isSimple: true, ...buttonProps },
    };
  }

  state = {
    focused: false,
  };

  pressedKeys = {};

  getCounterLength = memoize((value, splitBy) => {
    if (!value) {
      return 0;
    }
    if (!splitBy) {
      return value.length;
    }

    return value.split(splitBy).filter((s) => !!s).length;
  });

  onRef = (node) => {
    const { onRef, selected } = this.props;

    selected && node && node.select && node.select();

    onRef && onRef(node);
  };

  onBlur = (e) => {
    const { focused } = this.state;
    const { onBlur, readOnly } = this.props;

    if (readOnly && !focused) {
      return;
    }

    if (onBlur) {
      onBlur(e);
    }

    this.setState({ focused: false });
  };

  onChange = (e) => {
    const { max, type, onChange, onValidate, onEnterPress, allowShiftEnter } = this.props;

    if (e && e.target) {
      const { value } = e.target;

      if (onEnterPress && this.pressedKeys.Enter && (!allowShiftEnter || !this.pressedKeys.Shift)) {
        return;
      }

      if ((type === 'number' && validateNumber(value, this.props)) || (type === 'integer' && validateInteger(value, this.props))) {
        if (value > max) {
          e.target.value = max;
        } else {
          return;
        }
      } else if (onValidate && !onValidate(value, this.props)) {
        return;
      }
    }

    onChange && onChange(e, this.pressedKeys);
  };

  onFocus = (e) => {
    const { readOnly, onFocus } = this.props;

    if (readOnly) {
      return;
    }

    if (onFocus) {
      onFocus(e);
    }

    this.setState({ focused: true });
  };

  onKeyUp = (e) => {
    const { onKeyUp, onEscapePress } = this.props;

    this.pressedKeys[e.key] = false;

    if (e.key === 'Escape' && onEscapePress) {
      onEscapePress(e);
    }

    onKeyUp && onKeyUp(e);
  };

  onKeyDown = (e) => {
    const { onKeyDown } = this.props;

    this.pressedKeys[e.key] = true;

    onKeyDown && onKeyDown(e);
  };

  onKeyPress = (e) => {
    const { onKeyPress, onEnterPress } = this.props;

    if (e.key === 'Enter' && onEnterPress && !this.pressedKeys.Shift) {
      onEnterPress(e);
    } else if (onKeyPress) {
      onKeyPress(e);
    }
  };

  render() {
    const { focused } = this.state;

    const {
      id,
      icon,
      hint,
      type,
      onRef,
      value,
      label,
      error,
      loader,
      action,
      onKeyUp,
      formType,
      autoSize,
      readOnly,
      isActive,
      children,
      dropdown,
      onKeyDown,
      wrapInput,
      className,
      leftAddon,
      onKeyPress,
      rightAddon,
      actionText,
      showCounter,
      isHintSmall,
      counterProps,
      onEnterPress,
      asideRenderer,
      onEscapePress,
      onActionClick,
      actionPosition,
      counterSplitBy,
      allowShiftEnter,
      actionClassName,
      wrapperClassName,
      withoutErrorText,
      leftAddonClassName,
      rightAddonClassName,
      controlGroupHeaderRenderer,
      ...ownProps
    } = this.props;

    // eslint-disable-next-line no-nested-ternary
    const Component = autoSize ? AutoSizeInput : type === 'textarea' ? Textarea : 'input';

    const inputProps = {
      ...ownProps,
      id,
      type: formType || 'text',
      value,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      readOnly,
      onKeyUp: onEnterPress || onEscapePress ? this.onKeyUp : onKeyUp,
      onChange: this.onChange,
      className: cn('form-control', className, {
        '__is-active': isActive,
        '__has-danger': !!error,
        '__type-readonly': readOnly,
      }),
      onKeyDown: onEnterPress ? this.onKeyDown : onKeyDown,
      onKeyPress: onEnterPress ? this.onKeyPress : onKeyPress,
      'data-gramm_editor': 'false',
    };

    const withAside = !!asideRenderer || !!counterProps;
    const isRenderProps = typeof children === 'function';

    if (autoSize) {
      inputProps.inputRef = this.onRef;
      inputProps.inputClassName = inputProps.className;
    } else if (!isRenderProps) {
      inputProps.ref = this.onRef;
    }

    const input = isRenderProps ? children(inputProps) : <Component {...inputProps} />;

    const actionNode = (!!action || actionText) && (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div role="button" onClick={onActionClick} className={cn('form-control-group__addon __with-action', actionClassName)}>
        {!!action && <Icon className={action} />}
        {!!actionText && <span className="text-link">{actionText}</span>}
      </div>
    );

    return (
      <>
        {!!label && !withAside && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}

        {withAside && (
          <div className="form-group-header">
            <div className="form-group-header__title">
              {!!label && (
                <label htmlFor={id} className="form-label">
                  {label}
                </label>
              )}
            </div>

            <div className="form-group-header__aside">
              {asideRenderer
                ? asideRenderer()
                : counterProps &&
                  (showCounter === 'always' || (showCounter === 'onFocus' && focused)) && (
                    <Counter {...counterProps} length={this.getCounterLength(value, counterSplitBy)} className="__text-position" />
                  )}
            </div>
          </div>
        )}

        {!wrapInput ? (
          input
        ) : (
          <div
            className={cn(wrapperClassName, 'form-control-group h-mb-0', {
              '__with-header-control': !!controlGroupHeaderRenderer,
            })}
          >
            {!!controlGroupHeaderRenderer && <div className="form-control-group__header">{controlGroupHeaderRenderer()}</div>}

            {!!loader && (
              <div className="form-control-group__addon">
                <Loader size="md" inline pending />
              </div>
            )}

            {!!icon && (
              <div className="form-control-group__addon">
                <Icon className={icon} />
              </div>
            )}

            {!!dropdown && (
              <div className="form-control-group__addon __type-dropdown">
                <Dropdown {...Input.getDropdownProps(dropdown)} />
              </div>
            )}

            {!!leftAddon && <div className={cn('form-control-group__addon', leftAddonClassName)}>{leftAddon}</div>}

            {actionPosition === 'left' && actionNode}

            {input}

            {actionPosition === 'right' && actionNode}

            {!!rightAddon && <div className={cn('form-control-group__addon', rightAddonClassName)}>{rightAddon}</div>}
          </div>
        )}

        {hint && (isHintSmall ? <small className="form-hint text-gray">{hint}</small> : <div className="form-hint text-gray">{hint}</div>)}

        {!withoutErrorText && !!error && (
          <small className="form-hint text-danger">
            {error.includes('\n')
              ? error.split('\n').map((s, i) => (
                  <Fragment key={i}>
                    {i !== 0 && <br />}
                    {s}
                  </Fragment>
                ))
              : error}
          </small>
        )}
      </>
    );
  }
}
