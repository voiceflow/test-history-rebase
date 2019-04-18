import React, { Fragment, Component } from 'react';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { uploadImage } from 'utils/cloudinary';

import withRootPortal from './withRootPortal';

const mapStateToProps = ({ app }) => {
  return {
    user: app.user,
  };
};

const RootPortalInput = withRootPortal()(({ onRef, ...props }) => (
  <input {...props} ref={onRef} type="file" className="h-h-0 h-pos-a hidden" />
));

export default () => Wrapper => {
  class WithFileLoader extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithFileLoader');

    static propTypes = {
      id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        user_id: PropTypes.number.isRequired,
      }).isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      accept: PropTypes.string.isRequired,
      onInputRef: PropTypes.func,
      validateFile: PropTypes.func,
      onFileLoaded: PropTypes.func,
      validateImage: PropTypes.func,
      onProcessFile: PropTypes.func,
      useFileReader: PropTypes.bool,
      onImageLoaded: PropTypes.func,
      useImageReader: PropTypes.bool,
      onFileLoadError: PropTypes.func,
      onImageUploaded: PropTypes.func,
      onOpenFileModal: PropTypes.func,
      onCloseFileModal: PropTypes.func,
      onImageLoadError: PropTypes.func,
      useImageUploader: PropTypes.bool,
      onImageUploadError: PropTypes.func,
      onImageBeforeUpload: PropTypes.func,
    };

    static defaultProps = {
      tags: [],
      validateFile: () => true,
    };

    state = {
      file: null,
      fileId: nanoid(),
      fileReading: false,
      imageReading: false,
      imageUploading: false,
      fileModalOpened: false,
    };

    image = new Image();

    reader = new FileReader();

    imageLoaded = false;

    imageUploaded = false;

    componentDidMount() {
      this.image.setAttribute('crossorigin', 'anonymous');

      this.image.addEventListener('load', this.onImageLoaded);
      this.image.addEventListener('error', this.onImageLoadError);

      this.reader.addEventListener('load', this.onFileLoaded);
      this.reader.addEventListener('error', this.onFileLoadError);
    }

    componentWillUnmount() {
      this.image.removeEventListener('load', this.onImageLoaded);
      this.image.removeEventListener('error', this.onImageLoadError);

      this.reader.removeEventListener('load', this.onFileLoaded);
      this.reader.removeEventListener('error', this.onFileLoadError);
    }

    onChange = ({ target }) => {
      const [file] = target.files;

      this.processFile(file);
    };

    onLabelClick = () => {
      const { onOpenFileModal } = this.props;

      this.setState({ fileModalOpened: true });

      onOpenFileModal && onOpenFileModal();

      document.body.onfocus = this.onBodyFocus;
    };

    onBodyFocus = () => {
      const { onCloseFileModal } = this.props;

      this.setState({ fileModalOpened: false });

      onCloseFileModal && onCloseFileModal();

      document.body.onfocus = null;
    };

    onProcessFile = file => {
      this.processFile(file);
    };

    onFileLoaded = e => {
      const { fileId } = this.state;
      const { onFileLoaded, useImageReader } = this.props;

      onFileLoaded && onFileLoaded(fileId, e);

      useImageReader && this.readImage(e.target.result);

      this.setState({ fileReading: false });
    };

    onFileLoadError = e => {
      const { fileId } = this.state;
      const { onFileLoadError } = this.props;

      onFileLoadError && onFileLoadError(fileId, e);

      this.setState({ fileReading: false });
    };

    onImageLoaded = async () => {
      const { file, fileId } = this.state;
      const { onImageLoaded, validateImage, useImageUploader } = this.props;

      let isImageValid = true;

      if (validateImage) {
        isImageValid = await validateImage(this.image);
      }

      if (isImageValid) {
        this.imageLoaded = true;

        onImageLoaded && onImageLoaded(fileId, this.image, this.imageUploaded);
        validateImage && useImageUploader && this.uploadImage(fileId, file);
      }

      this.setState({ imageReading: false });
    };

    onImageLoadError = e => {
      const { fileId } = this.state;
      const { onImageLoadError } = this.props;

      onImageLoadError && onImageLoadError(fileId, e);

      this.setState({ imageReading: false });
    };

    async processFile(file) {
      const {
        validateFile,
        validateImage,
        onProcessFile,
        useFileReader,
        useImageReader,
        useImageUploader,
      } = this.props;

      const fileId = nanoid();

      this.setState({ file, fileId });

      const isFileValid = await validateFile(file);

      if (isFileValid) {
        onProcessFile && onProcessFile(fileId, file);

        (useFileReader || useImageReader) && this.readFile(file);
        !validateImage && useImageUploader && this.uploadImage(fileId, file);
      }
    }

    readFile(file) {
      this.setState({ fileReading: true });

      this.reader.readAsDataURL(file);
    }

    readImage(base64) {
      this.setState({ imageReading: true });

      this.imageLoaded = false;

      this.image.src = base64;
    }

    async uploadImage(fileId, file) {
      const { tags, user, onImageUploaded, onImageUploadError, onImageBeforeUpload } = this.props;

      this.imageUploaded = false;

      try {
        onImageBeforeUpload && onImageBeforeUpload(fileId, this.imageLoaded);

        this.setState({ imageUploading: true });

        const { data } = await uploadImage(file, {
          tags: [process.env.NODE_ENV, 'user-upload', ...tags],
          context: `userId=${user.user_id}`,
          upload_preset: 'unsigned',
        });

        this.imageUploaded = true;

        onImageUploaded && onImageUploaded(fileId, data, this.imageLoaded);
      } catch (err) {
        onImageUploadError && onImageUploadError(fileId, err);
      } finally {
        this.setState({ imageUploading: false });
      }
    }

    render() {
      const {
        id,
        accept,
        onInputRef,
        validateFile,
        onFileLoaded,
        onProcessFile,
        useFileReader,
        onFileLoadError,
        onImageUploaded,
        useImageUploader,
        onImageUploadError,
        ...wrapperProps
      } = this.props;
      const { fileId, fileReading, imageReading, imageUploading, fileModalOpened } = this.state;

      return (
        <Fragment>
          <RootPortalInput
            id={id}
            key={fileId}
            value=""
            onRef={onInputRef}
            accept={accept}
            onChange={this.onChange}
            disabled={fileReading || imageReading || imageUploading}
          />

          <Wrapper
            {...wrapperProps}
            accept={accept}
            fileReading={fileReading}
            onLabelClick={this.onLabelClick}
            imageReading={imageReading}
            onProcessFile={this.onProcessFile}
            imageUploading={imageUploading}
            fileModalOpened={fileModalOpened}
          />
        </Fragment>
      );
    }
  }

  return connect(
    mapStateToProps,
    null
  )(WithFileLoader);
};
