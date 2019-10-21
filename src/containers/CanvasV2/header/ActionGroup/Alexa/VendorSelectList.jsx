import cn from 'classnames';
import React, { Component } from 'react';

import Button from '@/components/Button';
import { updateVendor, vendorIdSelector } from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';

import { VendorList } from '../styled';

class VendorSelectList extends Component {
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    const { onBlur } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      onBlur();
    }
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  renderVendorList = () => {
    const { vendors, vendorId, updateVendor } = this.props;

    return vendors.map((vendor) => {
      return (
        <Button
          isActive={vendorId === vendor.id}
          className={cn('country-checkbox', 'vendor-button')}
          key={vendor.id}
          onClick={() => {
            updateVendor(vendor.id);
          }}
        >
          <span>{vendor.name}</span>
        </Button>
      );
    });
  };

  render() {
    return (
      <VendorList ref={this.setWrapperRef}>
        <FadeDownContainer>
          <div className="wh_select-list-header">SELECT VENDOR</div>
          {this.renderVendorList()}
        </FadeDownContainer>
      </VendorList>
    );
  }
}

const mapStateToProps = {
  vendorId: vendorIdSelector,
};

const mapDispatchToProps = {
  updateVendor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorSelectList);
