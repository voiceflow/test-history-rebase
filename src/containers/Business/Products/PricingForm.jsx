import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import _ from 'lodash';
import React from 'react';
import { ButtonDropdown, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import Button from '@/components/Button';

import { TAX_CATEGORY } from './Constants';

class PricingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      subdropOpen: false,
    };
    this.toggle = this.toggle.bind(this);
    this.getConsumable = this.getConsumable.bind(this);
    this.getSubscription = this.getSubscription.bind(this);
  }

  getSubscription() {
    const subTypes = ['Monthly', 'Yearly'];
    return (
      <div>
        <label>Bill Customer</label>
        <div className="d-flex position-relative flex-wrap align-items-center">
          <ButtonDropdown value={this.props.subType} isOpen={this.state.subdropOpen} toggle={() => this.toggle('subdropOpen')}>
            <DropdownToggle caret className="mr-2 form-bg mb-3">
              {this.props.subType}
            </DropdownToggle>
            <DropdownMenu>
              {_.map(subTypes, (category) => (
                <DropdownItem key={category} value={category} onClick={this.props.handleChange('subType')}>
                  {category}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </ButtonDropdown>
          <label style={{ color: '#8da2b5', marginTop: '-5px' }}>with a trial period of</label>
          <Input
            className="form-control form-bg ml-2 mr-2 mb-3 inline-form-control"
            name="trial"
            placeholder="0"
            type="number"
            min={0}
            pattern="^[0-9]"
            value={this.props.trial}
            onChange={this.props.handleChange('trial')}
          />
          <label style={{ color: '#8da2b5', marginTop: '-5px' }}>days.</label>
        </div>
      </div>
    );
  }

  getConsumable() {
    return (
      <div>
        <label>Units Included</label>
        <InputGroup>
          <InputGroupAddon addonType="append">
            <AvInput
              className="form-bg mb-3 mr-2 w-50"
              name="units"
              placeholder="1 unit min"
              min={1}
              pattern="^[0-9]"
              type="number"
              value={this.props.unit}
              onChange={this.props.handleChange('unit')}
              required
            />
            <label style={{ color: '#8da2b5' }}>per purchase.</label>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }

  toggle(dropdown) {
    this.setState((prevState) => ({
      [dropdown]: !prevState[dropdown],
    }));
  }

  render() {
    return (
      <AvForm onValidSubmit={() => this.props.updateStage(2)} onInvalidSubmit={() => this.props.updateStage(1)}>
        <AvGroup>
          <label>Product Type</label>
          <ButtonGroup className="mb-3 toggle-group">
            <Button
              isBtn
              isSecondary
              type="button"
              className="mr-2"
              outline={this.props.purchaseType !== 'ENTITLEMENT'}
              onClick={this.props.handleChange('purchaseType', 'ENTITLEMENT')}
              disabled={this.props.purchaseType === 'ENTITLEMENT'}
            >
              One-Time
            </Button>
            <Button
              isBtn
              isSecondary
              type="button"
              className="mr-2"
              outline={this.props.purchaseType !== 'SUBSCRIPTION'}
              onClick={this.props.handleChange('purchaseType', 'SUBSCRIPTION')}
              disabled={this.props.purchaseType === 'SUBSCRIPTION'}
            >
              Subscription
            </Button>
            <Button
              isBtn
              isSecondary
              type="button"
              className="mr-2"
              outline={this.props.purchaseType !== 'CONSUMABLE'}
              onClick={this.props.handleChange('purchaseType', 'CONSUMABLE')}
              disabled={this.props.purchaseType === 'CONSUMABLE'}
            >
              Consumable
            </Button>
          </ButtonGroup>
          {this.props.purchaseType === 'CONSUMABLE' ? this.getConsumable() : null}
          {this.props.purchaseType === 'SUBSCRIPTION' ? this.getSubscription() : null}
          <label>Price, $0.99 min / $99 max</label>
          <AvInput
            className="dollar-input form-control form-bg w-25"
            name="price"
            placeholder="0.99"
            pattern="^[0-9]"
            min={0.99}
            max={99}
            type="number"
            value={this.props.price}
            onChange={this.props.handleChange('price')}
            required
          />
          <AvFeedback>Please enter a valid price</AvFeedback>
          <label className="mt-3">Distribution Countries</label>
          <Dropdown disabled={true} isOpen={false} toggle={_.noop}>
            <DropdownToggle caret className="disabled-form form-bg mb-3">
              United states
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>United States</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <label>Tax Category</label>
          <Dropdown value={this.props.taxCategory} isOpen={this.state.dropdownOpen} toggle={() => this.toggle('dropdownOpen')}>
            <DropdownToggle caret className="form-bg">
              {_.startCase(_.toLower(this.props.taxCategory))}
            </DropdownToggle>
            <DropdownMenu>
              {_.map(TAX_CATEGORY, (category) => (
                <DropdownItem key={category} value={category} onClick={this.props.handleChange('taxCategory')} style={{ zIndex: 100 }}>
                  {_.startCase(_.toLower(category))}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </AvGroup>
        <div className="product-stage-button">
          <Button isFlatGray type="button" variant="contained" onClick={() => this.props.updateStage(0)}>
            Previous
          </Button>
          <Button isPrimary className="ml-2" style={{ fontSize: '15px' }} variant="contained" color="primary">
            Continue
          </Button>
        </div>
      </AvForm>
    );
  }
}

export default PricingForm;
