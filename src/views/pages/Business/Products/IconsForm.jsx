import React, {Component} from 'react'
import Image from 'views/components/Uploads/Image'
import {Button} from 'reactstrap'


class IconsForm extends Component {
    render() {
      return(
        <div>
          <div className="justify-content-center d-flex">
              <div>
                  <label className="mt-0 text-center"><b>Small icon</b> *</label>
                  <Image
                      className='icon-image small-icon'
                      path='/image/small_icon'
                      image={this.props.small_icon}
                      update={this.props.handleChange('small_icon')}
                    />
              </div>
              <div className="pl-4">
                  <label className="mt-0 text-center"><b>Large icon</b> *</label>
                  <Image
                      className='icon-image large-icon'
                      path='/image/large_icon'
                      image={this.props.large_icon}
                      update={this.props.handleChange('large_icon')}
                    />
              </div>
          </div>
          <div className="product-stage-button">
            <Button className='btn-tertiary-gray'
              variant="contained"
              onClick={() => this.props.updateStage(2)}
            >
              Previous
            </Button>
            <Button className='btn-primary ml-2'
              variant="contained"
              onClick={() => this.props.updateStage(4)}
            >
              Continue
            </Button>
          </div>
        </div>
      )
    }
}

export default IconsForm;
