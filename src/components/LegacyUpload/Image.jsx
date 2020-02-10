import axios from 'axios';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import { Spinner } from '@/components/Spinner';
import { HTTPS_URL_REGEX, VARIABLE_REGEXP } from '@/constants';

const MAX_SIZE = 5 * 1024 * 1024;
class Image extends Component {
  constructor(props) {
    super(props);

    this.onDropImage = this.onDropImage.bind(this);

    this.state = {
      error: null,
      loading: false,
      url_open: false,
      url: '',
    };
    this.max_size = this.props.max_size || MAX_SIZE;
  }

  onReset = () => {
    this.props.update(null);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onDropImage(files, rejected) {
    if (files.length === 1) {
      const data = new FormData();
      data.append('image', files[0]);
      this.setState({ loading: true });
      axios
        .post(this.props.path || '/image', data)
        .then((res) => {
          this.setState({ loading: false });
          this.props.update(res.data);
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
          window.alert('Image Upload Error');
        });
    } else if (Array.isArray(rejected) && rejected.length === 1 && rejected[0].size > this.max_size) {
      this.setState({
        error: (
          <div>
            <b>
              File is too large
              <br />({(this.max_size / (1024 * 1024)).toFixed(1)} MB max)
            </b>
          </div>
        ),
      });
    }
  }

  render() {
    let render;
    if (this.state.loading) {
      render = (
        <div className="image-box super-center d-flex">
          <Spinner isEmpty />
        </div>
      );
    } else if (this.state.error) {
      render = (
        <div className="dropzone reject enter-url">
          <div className="text-center text-danger">
            {this.state.error}
            <Button isBtn onClick={() => this.setState({ error: false })} className="upload-btn exit">
              <i className="far fa-chevron-left" />
              Back
            </Button>
          </div>
        </div>
      );
    } else if (this.props.image && this.props.replace) {
      render = (
        <Dropzone
          className="dropzone image-box"
          activeClassName="active"
          rejectClassName="reject"
          multiple={false}
          disableClick={false}
          maxSize={this.max_size}
          accept="image/jpeg,image/png"
          onDrop={this.onDropImage}
        >
          <div className="image" style={{ backgroundImage: `url(${this.props.image})` }} />
          <div className="rejected-file text-danger text-center super-center h-100">File not Accepted</div>
        </Dropzone>
      );
    } else if (this.props.image && typeof this.props.image === 'string') {
      if (VARIABLE_REGEXP.test(this.props.image)) {
        render = (
          <div className="image-box super-center d-flex">
            <div>{this.props.image}</div>
            <Button className="close" disabled={this.props.isDisabled} onClick={this.onReset} />
          </div>
        );
      } else if (!HTTPS_URL_REGEX.test(this.props.image)) {
        render = (
          <div className="image-box super-center d-flex">
            <div className="rejected-file text-danger text-center super-center h-100">
              Please check your URL or your {'{'}variable{'}'}
            </div>
            <Button className="close" disabled={this.props.isDisabled} onClick={this.onReset} />
          </div>
        );
      } else {
        render = (
          <div className="image-box">
            <div className="image" style={{ backgroundImage: `url(${this.props.image})` }} />
            <Button className="close" disabled={this.props.isDisabled} onClick={this.onReset} />
          </div>
        );
      }
    } else if (this.props.image) {
      render = (
        <div className="image-box">
          <div className="image" style={{ backgroundImage: `url(${this.props.image})` }} />
          <Button className="close" disabled={this.props.isDisabled} onClick={this.onReset} />
        </div>
      );
    } else if (this.state.url_open) {
      render = (
        <div className="dropzone">
          <div className="text-center w-100">
            <label>Enter Image URL</label>
            <Input placeholder="URL Link (must be [https])" value={this.state.url} onChange={this.handleChange} name="url" />
            <Button isFlat onClick={() => this.setState({ url_open: false })} className="mt-3 mr-1">
              Back
            </Button>
            <Button isBtn isPrimary onClick={() => this.props.update(this.state.url)} className="mr-1">
              Confirm
            </Button>
          </div>
        </div>
      );
    } else {
      render = (
        <Dropzone
          className="dropzone image-upload-icon"
          activeClassName="active"
          rejectClassName="reject"
          multiple={false}
          disableClick={false}
          maxSize={this.max_size}
          accept="image/jpeg,image/png"
          onDrop={this.onDropImage}
        >
          <div className="w-100">
            <div className="drop-child">
              {this.props.url && (
                <Button
                  isBtn
                  isLink
                  className="mt-5 pt-4 pointer"
                  style={{ fontSize: 15 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setState({ url_open: true });
                  }}
                >
                  Add URL or {'{'}variable{'}'}
                </Button>
              )}
            </div>
            <div className="rejected-file text-danger text-center">
              {this.props.tiny ? <i className="far fa-exclamation-triangle" /> : 'File not Accepted'}
            </div>
          </div>
        </Dropzone>
      );
    }

    return (
      <div
        className={
          (this.props.className ? this.props.className : 'image-standard') +
          (this.props.isDisabled ? ' disabled-image' : '') +
          (this.props.tiny ? ' tiny' : '')
        }
      >
        {!!this.props.title && <label>{this.props.title}</label>}
        {render}
      </div>
    );
  }
}

export default Image;
