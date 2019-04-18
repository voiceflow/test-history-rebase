import React, { Fragment, Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import IconUploader from '../IconUploader';

export default class DnDIcons extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    smallUrl: PropTypes.string,
    largeUrl: PropTypes.string,
    onLoaded: PropTypes.func,
  };

  static getDetails() {
    return (
      <Fragment>
        <p>
          Use image with 108x108 pixel resolution for Small icon and 512x512 pixel resolution for
          Large icon.
        </p>
        <p>Images with higher resolution will be automatically resized to fit the format.</p>
      </Fragment>
    );
  }

  onReplace = () => {
    const { largeUrl, onLoaded } = this.props;

    onLoaded('smallUrl', largeUrl.replace('w_512,h_512', 'w_108,h_108'));
  };

  render() {
    const { tags, largeUrl, smallUrl, disabled, onLoaded } = this.props;

    return (
      <div className={cn('dnd-icons', { '__type-view': disabled })}>
        <IconUploader
          id="largeUrl"
          url={largeUrl}
          tags={tags}
          size={512}
          title="Large Icon"
          disabled={disabled}
          onLoaded={src => onLoaded('largeUrl', src)}
          onReplace={this.onReplace}
          withReplace={!disabled}
          description="Drop image here or"
        />

        <IconUploader
          id="smallUrl"
          url={smallUrl}
          tags={tags}
          size={108}
          title="Small Icon"
          disabled={disabled}
          onLoaded={src => onLoaded('smallUrl', src)}
          description="Drop image here or"
        />
      </div>
    );
  }
}
