import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import React from 'react';

import Button from '@/components/Button';

class ProductDescriptionForm extends React.Component {
  render() {
    return (
      <AvForm onValidSubmit={() => this.props.continue(1)} onInvalidSubmit={() => this.props.continue(0)}>
        <AvGroup>
          <label>Product Name</label>
          <AvInput
            className="form-bg"
            name="name"
            placeholder="e.g. Science"
            value={this.props.name}
            onChange={this.props.handleChange('name')}
            required
          />
          <AvFeedback>Name is required</AvFeedback>
          <label className="label-margin-top">Short Description</label>
          <AvInput
            className="form-bg"
            name="summary"
            placeholder="e.g. This will unlock 150 science questions in Trivia Skill."
            value={this.props.summary}
            onChange={this.props.handleChange('summary')}
            required
          />
          <AvFeedback>Description is required</AvFeedback>
        </AvGroup>
        <div className="product-stage-button">
          <Button isPrimary variant="contained" color="publish">
            Continue
          </Button>
        </div>
      </AvForm>
    );
  }
}

export default ProductDescriptionForm;
