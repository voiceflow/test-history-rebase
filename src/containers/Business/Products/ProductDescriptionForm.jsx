import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import Button from 'components/Button';
import React from 'react';

class ProductDescriptionForm extends React.Component {
  render() {
    return (
      <div>
        <AvForm onValidSubmit={() => this.props.continue(1)}>
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
      </div>
    );
  }
}

export default ProductDescriptionForm;
