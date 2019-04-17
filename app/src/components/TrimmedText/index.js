import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

export default class TrimmedText extends Component {
  static propTypes = {
    style: PropTypes.object,
    tagName: PropTypes.string,
    children: PropTypes.any,
    maxHeight: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    tagName: 'div',
  };

  componentDidMount() {
    this.onTryToTrim();

    window.addEventListener('resize', this.onTryToTrim);
  }

  componentDidUpdate() {
    this.onTryToTrim();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onTryToTrim);
  }

  onRef = node => {
    this.node = node;
  };

  onTryToTrim = () => {
    if (!this.props.maxHeight) {
      return;
    }

    if (this.node.scrollHeight > this.node.clientHeight) {
      this.node.classList.add('text-trimmed');
    } else {
      this.node.classList.remove('text-trimmed');
    }
  };

  render() {
    const { tagName: TagComponent, children, maxHeight, className, ...ownProps } = this.props;

    let { style } = this.props;

    if (maxHeight) {
      style = { ...style, maxHeight, wordWrap: 'break-word' };
    }

    return (
      <TagComponent
        {...ownProps}
        ref={this.onRef}
        style={style}
        className={cn('text-trimmed', className, {
          __multiline: !!maxHeight,
        })}
      >
        {children}
      </TagComponent>
    );
  }
}
