import React, { Component } from 'react';

import Button from '@/components/Button';
import Image from '@/components/Uploads/Image';

class IconsForm extends Component {
  render() {
    return (
      <div>
        <div className="justify-content-center d-flex">
          <div>
            <label className="mt-0 text-center">
              <b>Small icon</b> *
            </label>
            <Image
              className="icon-image small-icon"
              path="/image/small_icon"
              image={this.props.small_icon}
              update={this.props.handleChange('small_icon')}
            />
          </div>
          <div className="pl-4">
            <label className="mt-0 text-center">
              <b>Large icon</b> *
            </label>
            <Image
              className="icon-image large-icon"
              path="/image/large_icon"
              image={this.props.large_icon}
              update={this.props.handleChange('large_icon')}
            />
          </div>
        </div>
        <div className="product-stage-button">
          <Button isFlatGray variant="contained" onClick={() => this.props.updateStage(2)}>
            Previous
          </Button>
          <Button isPrimary className="ml-2" variant="contained" onClick={() => this.props.updateStage(4)}>
            Continue
          </Button>
        </div>
      </div>
    );
  }
}

export default IconsForm;
