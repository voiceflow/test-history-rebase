import React from 'react';
import {connect} from 'react-redux';

import './VendorList.css';

class VendorList extends React.Component {
  
  renderVendors() {
    
    const {vendors} = this.props;
    
    if (vendors.length > 0) {
      return (
        <div className="vl__wrapper">
          <div className="ctg__tbl-header">
            <table cellPadding="0" cellSpacing="0" border="0" className="ctg__table">
              <thead>
              <tr>
                <th>Creator ID</th>
                <th>Project ID</th>
                <th>Vendor ID</th>
                <th>Amazon ID</th>
              </tr>
              </thead>
            </table>
          </div>
          <div className="vl__tbl-content">
            <table cellPadding="0" cellSpacing="0" border="0" className="ctg__table">
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor.project_id}>
                    <td>{vendor.creator_id}</td>
                    <td>{vendor.project_id}</td>
                    <td>{vendor.vendor_id}</td>
                    <td>{vendor.amzn_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    } else {
      return (
        <div className="cl__no_charges">
          <p>Search for vendors in the search bar above.</p>
          <p>If you have already searched, please wait patiently as the developer of this page was
            also too lazy to detect when loading happens.</p>
        </div>
      )
    }
    
  }
  
  render() {
    
    console.log('rendering vendors: ', this.props.vendors);
    
    return (
      <div className="vl__wrapper">
        {this.renderVendors()}
      </div>
    )
  }
  
}

const mapStateToProps = state => ({
  vendors: state.admin.vendors
});

export default connect(mapStateToProps)(VendorList);
