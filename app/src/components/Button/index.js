import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Button.css';

import { track } from 'utils/tracker';

import Icon from '../Icon';
import Loader from '../Loader';
import Tooltip from '../Tooltip';

export default class Button extends Component {
  static propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string,
    onRef: PropTypes.any,
    isFlat: PropTypes.bool,
    isText: PropTypes.bool,
    isIcon: PropTypes.bool,
    onClick: PropTypes.func,
    isSimple: PropTypes.bool,
    isAction: PropTypes.bool,
    isActive: PropTypes.bool,
    isPrimary: PropTypes.bool,
    trackName: PropTypes.string,
    trackOpts: PropTypes.object,
    trackEvent: PropTypes.string,
    vendorIcon: PropTypes.string,
    isIconFlat: PropTypes.bool,
    withLoader: PropTypes.bool,
    isDropdown: PropTypes.bool,
    withCounter: PropTypes.bool,
    isSecondary: PropTypes.bool,
    tooltipText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    iconPosition: PropTypes.oneOf(['left', 'right']),
    tooltipProps: PropTypes.object,
    isHiddenIcon: PropTypes.bool,
    isIconBordered: PropTypes.bool,
    isDropdownMenu: PropTypes.bool,
    isActionSuccess: PropTypes.bool,
    withDangerIndicator: PropTypes.bool,
  };

  static defaultProps = {
    onRef: () => null,
    trackEvent: 'Button Click',
    iconPosition: 'right',
  };

  onClick = e => {
    const { onClick, trackName, trackOpts, trackEvent } = this.props;

    trackName && track(trackEvent, trackName, trackOpts);

    onClick && onClick(e);
  };

  render() {
    const {
      icon,
      isBtn,
      onRef,
      isNav,
      isFlat,
      isIcon,
      disabled,
      isSmall,
      isFloat,
      isClear,
      isClose,
      isLarge,
      isSimple,
      isWhite,
      isWhiteCirc,
      isBlack,
      isVoid,
      isDefault,
      isRound,
      isDashed,
      children,
      isActive,
      isAction,
      isFaux,
      isBlock,
      isLink,
      isLinkLarge,
      isFlatVariable,
      isCloseSmall,
      className,
      isWarning,
      isPrimary,
      isPurple,
      trackName,
      trackOpts,
      trackEvent,
      withLoader,
      vendorIcon,
      isIconFlat,
      isDropdown,
      withCounter,
      isSecondary,
      isDisabled,
      isSaveIcon,
      tooltipText,
      tooltipProps,
      iconPosition,
      isPrimarySmall,
      isIconBordered,
      isTransparent,
      isDropdownMenu,
      isFlatGray,
      isNavBordered,
      isActionSuccess,
      withDangerIndicator,
      outline,
      ...props
    } = this.props;

    const buttonProps = {
      ref: props.to ? undefined : onRef,
      className: cn(className, {
        'btn': isBtn,
        'btn-tertiary tertiary': isFlat,
        'btn-tertiary variable': isFlatVariable,
        'btn-icon': isIcon,
        'btn-sm': isSmall,
        'btn-lg': isLarge,
        'nav-btn': isNav,
        'close': isClose,
        'close small': isCloseSmall,
        'nav-btn border': isNavBordered,
        'btn-outline-secondary': outline,
        'btn-action': isAction,
        'btn-simple': isSimple,
        'btn-primary': isPrimary,
        'btn-void': isVoid,
        'btn-primary __small': isPrimarySmall,
        'btn-link': isLink,
        'btn-link __large': isLinkLarge,
        'btn-float': isFloat,
        'faux': isFaux,
        'btn-clear': isClear,
        'btn-default': isDefault,
        'white-btn': isWhite,
        'white-btn circ': isWhiteCirc,
        'disabled': disabled || isDisabled,
        'purple-btn': isPurple,
        'btn-black': isBlack,
        'active': isActive,
        'btn-block': isBlock,
        'dropdown-button': isDropdown,
        'btn-secondary': isSecondary && !outline,
        'btn-transparent': isTransparent,
        'btn-icon-flat': isIconFlat,
        'btn-warning': isWarning,
        'round-btn': isRound,
        'btn-icon __type-save': isSaveIcon,
        'btn-action __type-success': isActionSuccess,
        'btn-tertiary gray': isFlatGray,
        'btn-danger': withDangerIndicator,
      }),
      ...props,
      onClick: this.onClick,
    };

    if (props.to) {
      buttonProps.innerRef = onRef;
    }

    const ButtonComponent = props.to ? Link : props.href ? 'a' : 'button';

    const iconElm =
      !!icon &&
      (isIconFlat || isIcon ? (
        <Icon className={icon} />
      ) : (
        <span className="btn__icon">
          <Icon className={icon} />
        </span>
      ));

    const content = (
      <Fragment>
        {!!vendorIcon && (
          <span className="btn__icon">
            <Icon custom className={`vendor-icon vendor-icon-${vendorIcon}`} />
          </span>
        )}

        {iconPosition === 'left' && iconElm}

        {children}

        {iconPosition === 'right' && iconElm}

        {withLoader && (
          <span className="btn__icon">
            <Loader size="sm" pending />
          </span>
        )}
      </Fragment>
    );

    return tooltipText ? (
      <Tooltip
        text={tooltipText}
        TagName={ButtonComponent}
        {...tooltipProps}
        buttonProps={buttonProps}
      >
        {content}
      </Tooltip>
    ) : (
      <ButtonComponent {...buttonProps}>{content}</ButtonComponent>
    );
  }
}
