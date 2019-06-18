import Button from 'components/Button';
import Input from 'components/Input';
import { findCreator, getVendors } from 'ducks/admin';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import VendorList from './components/VendorList/VendorList';

class Vendors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    if (_.has(this.props, ['match', 'params', 'creator_id'])) {
      // The creator id we are looking for
      const setCreatorId = this.props.match.params.creator_id;
      this.setState({
        searchTerm: setCreatorId,
      });
      // Get the charges for the user
      this.props.getVendors(setCreatorId);
      if (this.props.creator.creator_id && this.props.creator.creator_id.toString() !== setCreatorId) {
        this.props.findCreator(setCreatorId);
      }
    }
  }

  handleSearch = (e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  };

  render() {
    return (
      <div className="fb_wrapper">
        <h3 className="fb_header">Vendors</h3>
        <div className="fb_search">
          <div>
            <div className="row">
              <div className="col-sm-8">
                <Input
                  className="search-input form-control-2"
                  placeholder="Find creator by id or email"
                  onChange={this.handleSearch}
                  onEnterPress={() => {
                    this.props.getVendors(this.state.searchTerm);
                  }}
                  value={this.state.searchTerm}
                  type="text"
                />
              </div>
              <div className="col-sm-4">
                <Button className="fb_search_button" isPrimary onClick={() => this.props.getVendors(this.state.searchTerm)}>
                  Search
                </Button>
              </div>
            </div>
            <div className="fb_refresh_wrapper">
              <span
                className="fb_refresh"
                onClick={() => {
                  this.props.getVendors(this.state.searchTerm);
                }}
              >
                Refresh <i className="fas fa-sync" />
              </span>
            </div>
          </div>
          <VendorList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.creator,
});

export default connect(
  mapStateToProps,
  { findCreator, getVendors }
)(Vendors);
