import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    withIcon: PropTypes.bool,
    isActive: PropTypes.bool,
    isVisuals: PropTypes.bool,
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
    withAnimation: PropTypes.bool,
    isIconBordered: PropTypes.bool,
    isDropdownMenu: PropTypes.bool,
    isActionSuccess: PropTypes.bool,
    isPrimaryWithIcon: PropTypes.bool,
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
      onRef,
      isFlat,
      isIcon,
      isText,
      withIcon,
      isSimple,
      children,
      isActive,
      isAction,
      className,
      isPrimary,
      isVisuals,
      trackName,
      trackOpts,
      trackEvent,
      withLoader,
      vendorIcon,
      isIconFlat,
      isDropdown,
      withCounter,
      isSecondary,
      tooltipText,
      tooltipProps,
      iconPosition,
      isHiddenIcon,
      isActionIcon,
      withAnimation,
      isIconBordered,
      isDropdownMenu,
      isActionSuccess,
      isPrimaryWithIcon,
      withDangerIndicator,
      ...props
    } = this.props;

    const buttonProps = {
      ref: props.to ? undefined : onRef,
      className: cn('btn', className, {
        'btn-flat': isFlat,
        'btn-text': isText,
        'btn-icon': isIcon,
        'btn-action': isAction,
        'btn-simple': isSimple,
        'btn-primary': isPrimary,
        '__is-active': isActive,
        'btn-visuals': isVisuals,
        '__with-icon': withIcon || withLoader,
        'btn-dropdown': isDropdown,
        'btn-secondary': isSecondary,
        'btn-icon-flat': isIconFlat,
        '__with-counter': withCounter,
        '__with-animation': withAnimation || withLoader,
        'btn-dropdown-menu': isDropdownMenu,
        'btn-icon-bordered': isIconBordered,
        'btn-icon __type-hidden': isHiddenIcon,
        'btn-primary __with-icon': isPrimaryWithIcon,
        'btn-action __type-success': isActionSuccess,
        '__with-indicator __type-danger': withDangerIndicator,
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
      (isIconFlat || isIcon || isHiddenIcon ? (
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
