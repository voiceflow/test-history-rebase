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
      if (this.props.creator && this.props.creator.creator_id == setCreatorId) {
        console.log('creator already exists, using', setCreatorId);

      } else {
        console.log('creator does not exist in store');
        this.props.findCreator(setCreatorId);
      }
    }
  }

  handleSearch = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      console.log('searching for: ', this.state.searchTerm);
      this.props.getCharges(this.state.searchTerm);
    } else {
      this.setState({
        searchTerm: e.target.value
      })
    }
  };

  render() {
    return (
      <div className="fb_wrapper">
        <div className="fb_search">
          <Input
            className="search-input form-control-2"
            placeholder="Find creator by id or email"
            onKeyDown={this.handleSearch}
            value={this.state.searchTerm}
            type="text"
          />
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
