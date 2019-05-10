import React, { Component } from 'react';
import cn from 'classnames'

export default class VendorSelectList extends Component {
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onBlur()
    }
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  render() {

    return <div className='vendors-select-list' ref={this.setWrapperRef}>
      {this.props.vendors.map(vendor => {
        return <div key={vendor.id} onClick={() => this.props.onSelect(vendor)} className={cn({selected: this.props.selectedVendor === vendor.id})}>
          {vendor.name}
        </div>
      })}
    </div>
  }
}