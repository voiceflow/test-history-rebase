import React, { Fragment, PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addTransforms } from 'utils/cloudinary';

import { showNotification } from 'containers/Notifications/actions';

import Loader from '../Loader';
import Button from '../Button';
import FileDropWrapper from '../FileDropWrapper';

export class IconUploader extends PureComponent {
  static ERRORS = {
    WRONG_SIZES: 'The icon resolution must be at least $sizex$size pixels.',
    CAN_NOT_PROCESS_FILE: 'The image cannot be processed. Please wait a few minutes and try again.',
  };

  static propTypes = {
    url: PropTypes.string,
    id: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    tags: PropTypes.array,
    title: PropTypes.string.isRequired,
    onLoaded: PropTypes.func,
    disabled: PropTypes.bool,
    onReplace: PropTypes.func,
    withReplace: PropTypes.bool,
    description: PropTypes.string.isRequired,
  };

  onError = () => {
    const { showNotification } = this.props;

    showNotification(IconUploader.ERRORS.CAN_NOT_PROCESS_FILE, 'error');
  };

  onValidateImage = ({ width, height }) => {
    const { size, showNotification } = this.props;

    if (width < size || height < size) {
      showNotification(IconUploader.ERRORS.WRONG_SIZES.replace(/\$size/g, size), 'error');

      return false;
    }

    return true;
  };

  render() {
    const {
      id,
      url,
      size,
      tags,
      title,
      disabled,
      onLoaded,
      onReplace,
      withReplace,
      description,
    } = this.props;

    return (
      <FileDropWrapper
        id={id}
        tags={tags}
        accept="image/jpg,image/png,image/jpeg"
        disabled={disabled}
        className={cn('dnd-icons-panel', { __empty: !url })}
        validateImage={this.onValidateImage}
        useImageReader
        onFileLoadError={this.onError}
        onImageUploaded={(_, { secure_url: src }) =>
          onLoaded(addTransforms(src, `w_${size},h_${size},c_fill`))
        }
        useImageUploader
        onImageLoadError={this.onError}
        onImageUploadError={this.onError}
      >
        {({ fileReading, imageReading, imageUploading }) => (
          <Fragment>
            <div className="dnd-icons-panel__title">{title}</div>

            <label
              style={{
                cursor: disabled ? 'default' : 'pointer',
                ...(url ? { display: 'block', backgroundImage: `url(${url})` } : {}),
              }}
              htmlFor={id}
              className="dnd-icons-panel__image"
            >
              <Loader
                style={{
                  top: 2,
                  left: 2,
                  right: 2,
                  bottom: 2,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                }}
                size="md"
                pending={fileReading || imageReading || imageUploading}
              />
            </label>

            {!!description && !disabled && (
              <label
                style={{ display: 'block' }}
                htmlFor={id}
                className="dnd-icons-panel__description"
              >
                {`${description} `}
                <span className="form-file text-link">Browse</span>
              </label>
            )}

            {withReplace && (
              <div className="dnd-icons-panel__replace">
                <Button icon="arrow-forward" isIcon onClick={onReplace} />
              </div>
            )}
          </Fragment>
        )}
      </FileDropWrapper>
    );
  }
}

export default connect(
  null,
  { showNotification }
)(IconUploader);
