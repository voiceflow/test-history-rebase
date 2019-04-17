import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export default function TextLink(props) {
  const {
    href,
    target,
    isSmall,
    innerRef,
    children,
    className,
    clearDefaultClass,
    ...ownProps
  } = props;

  const TextComponent = isSmall ? 'small' : 'span';

  return href ? (
    <a ref={innerRef} href={href} target={target} className={className} {...ownProps}>
      {children}
    </a>
  ) : (
    <TextComponent
      {...ownProps}
      ref={innerRef}
      role="button"
      tabIndex="0"
      className={cn({ 'text-link': !clearDefaultClass, [className]: !!className })}
    >
      {children}
    </TextComponent>
  );
}

TextLink.propTypes = {
  href: PropTypes.string,
  target: PropTypes.string,
  isSmall: PropTypes.bool,
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  clearDefaultClass: PropTypes.bool,
};
