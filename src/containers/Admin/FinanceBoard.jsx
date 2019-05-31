import React from 'react';
import {connect} from 'react-redux';
import {getCharges, findCreator} from "ducks/admin";

import './FinanceBoard.css';
import Input from "components/Input";
import ChargeList from "./components/ChargeList/ChargeList";

class FinanceBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    }
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.creator_id) {
      // The creator id we are looking for
      const setCreatorId = this.props.match.params.creator_id;
      this.setState({
        searchTerm: setCreatorId
      });
      // Get the charges for the user
      this.props.getCharges(setCreatorId);
      // Purposefully using coercion to compare the int creator id in store and the string param one
      if (this.props.creator && this.props.creator.creator_id != setCreatorId) {
        this.props.findCreator(setCreatorId);
      }
    }
  }

  handleSearch = e => {
    this.setState({
      searchTerm: e.target.value
    })
  };

  render() {
    return (
      <div className="fb_wrapper">
        <h3 className="fb_header">
          Voiceflow Revenue Agency <span className={'admin_highlight_green'}>Will is our favourite intern</span>
        </h3>
        <div className="fb_search">
          <div>
            <Input
              className="search-input form-control-2"
              placeholder="Find creator by id or email"
              onChange={this.handleSearch}
              onEnterPress={() => this.props.getCharges(this.state.searchTerm)}
              value={this.state.searchTerm}
              type="text"
            />
            <div className="fb_refresh_wrapper">
              <span className="fb_refresh" onClick={() => this.props.getCharges(this.state.searchTerm)}>
                Refresh <i className="fas fa-sync" />
              </span>
            </div>
          </div>
          <ChargeList/>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  creator: state.admin.creator
});

export default connect(mapStateToProps, {findCreator, getCharges})(FinanceBoard);
