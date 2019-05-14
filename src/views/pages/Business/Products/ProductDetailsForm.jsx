import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Input } from 'reactstrap';
import {Tooltip} from 'react-tippy';

import Button from 'components/Button'

class ProductDetailsForm extends React.Component {
  render() {
    return(
      <div>
        <AvForm onValidSubmit={this.props.submit}>
          <AvGroup>
            <label>
              Keywords
              &nbsp;
              <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title="Keywords to identify this product in searches"
              >
                <i className="fas fa-question-circle text-dull mr-1"/>
              </Tooltip>
            </label>
            <Input
              placeholder="Enter keywords separated by commas or spaces"
              value={this.props.keywords.toString()}
              onChange={this.props.handleChange('keywords')}
            />
          <label className="label-margin-top">
              In-App Card Description
              &nbsp;
              <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title="This product description will show up on the user's Alexa App on their phone"
              >
                <i className="fas fa-question-circle text-dull mr-1"/>
              </Tooltip>
            </label>
            <AvInput
              name="description"
              placeholder="Enter a text to display on skill card"
              value={this.props.description}
              onChange={this.props.handleChange('description')}
              required
            />
            <AvFeedback>Description is required</AvFeedback>
            <label className="label-margin-top">
              Purchase Prompt
              &nbsp;
              <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title="What Alexa will say to prompt the user"
              >
                <i className="fas fa-question-circle text-dull mr-1"/>
              </Tooltip>
            </label>
            <AvInput
              name="prompt"
              placeholder="Enter a product description"
              value={this.props.prompt}
              onChange={this.props.handleChange('prompt')}
              required
            />
            <AvFeedback>Purchase prompt is required</AvFeedback>
            <label className="label-margin-top">
              Bought Description
              &nbsp;
              <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title="What Alexa will say after the user buys the product"
              >
                <i className="fas fa-question-circle text-dull mr-1"/>
              </Tooltip>
            </label>
            <AvInput
              name="buyDescription"
              placeholder="Enter a buy product description"
              value={this.props.buyDescription}
              onChange={this.props.handleChange('buyDescription')}
              required
            />
          <AvFeedback>Buy description is required</AvFeedback>
            <label className="label-margin-top">
              Privacy Policy URL
            </label>
            <AvInput
              name="policy"
              placeholder="Enter a URL to your privacy policy"
              value={this.props.policy}
              onChange={this.props.handleChange('policy')}
              required
            />
            <AvFeedback>Policy URL is required</AvFeedback>
            <label className="label-margin-top">
              Testing Instructions
              &nbsp;
              <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title="Testing instructions for Amazon Skill Reviewers buying the product"
              >
                <i className="fas fa-question-circle text-dull mr-1"/>
              </Tooltip>
            </label>
            <Input
              placeholder="Testing Instructions"
              value={this.props.testInstruct}
              onChange={this.props.handleChange('testInstruct')}
            />
          </AvGroup>
          <div className="product-stage-button">
            <Button
              isFlatGray
              className="mr-2"
              variant="contained"
              onClick={() => this.props.updateStage(3)}
            >
              Previous
            </Button>
            <Button
              isPrimary
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </AvForm>
      </div>
    )
  }
}

export default ProductDetailsForm;
