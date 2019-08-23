import cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import { updateVendorId } from '@/ducks/project';

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
    const { vendors, vendor_id, updateVendorId } = this.props;
    return vendors.map((vendor) => {
      return (
        <Button
          isActive={vendor_id === vendor.id}
          className={cn('country-checkbox', 'vendor-button')}
          key={vendor.id}
          onClick={() => {
            updateVendorId(vendor.id);
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
        <div className="wh_select-list-header">SELECT VENDOR</div>
        {this.renderVendorList()}
      </VendorList>
    );
  }
}

const mapStateToProps = (state) => ({
  vendor_id: state.skills.skill.vendor_id,
});

export default connect(
  mapStateToProps,
  { updateVendorId }
)(VendorSelectList);
