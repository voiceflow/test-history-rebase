import './FinanceBoard.css';

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { findCreator, getCharges } from '@/admin/store/ducks/admin';
import { AdminTitle } from '@/admin/styles';
import Button from '@/componentsV2/Button';
import Input from '@/componentsV2/Input';

import ChargeList from './components/ChargeList/ChargeList';

class FinanceBoard extends React.Component {
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
      this.props.getCharges(setCreatorId);
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
      <>
        <AdminTitle>Manage/Update Billing</AdminTitle>
        <hr />

        <div className="fb_search">
          <div>
            <div className="row">
              <div className="col-sm-8">
                <Input
                  className="search-input"
                  placeholder="Find creator by id or email"
                  onChange={this.handleSearch}
                  onEnterPress={() => this.props.getCharges(this.state.searchTerm)}
                  value={this.state.searchTerm}
                  type="text"
                />
              </div>
              <div className="col-sm-4">
                <Button className="fb_search_button" onClick={() => this.props.getCharges(this.state.searchTerm)}>
                  Search
                </Button>
              </div>
            </div>

            <div className="fb_refresh_wrapper">
              <span className="fb_refresh" onClick={() => this.props.getCharges(this.state.searchTerm)}>
                Refresh <i className="fas fa-sync" />
              </span>
            </div>
          </div>
          <ChargeList />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.creator,
});

export default connect(
  mapStateToProps,
  { findCreator, getCharges }
)(FinanceBoard);
