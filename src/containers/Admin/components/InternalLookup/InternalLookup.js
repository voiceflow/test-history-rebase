import React from 'react';
import {connect} from 'react-redux';
import {Input} from 'reactstrap';
import Button from 'components/Button';
import _ from 'lodash';

import './InternalLookup.css';
import TeamSummary from "../TeamSummary/TeamSummary";
import UserCard from "../UserCard/UserCard";
import {findCreator} from "ducks/admin";

class InternalLookup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user_id: '',
      loading: false,
      skill_filter: '',
      filtered_boards: null,
      expand_all_boards: false,
    }
  }

  // do more leetcode shame on u
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    if (event.target.name === 'skill_filter') {
      if (event.target.value === '') {
        this.clearSearch();
      } else {
        let filtered_boards = _.cloneDeep(this.props.boards);
        // Need to reduce the boards array
        filtered_boards = filtered_boards.filter(board => {
          let found = false;
          for (let i = 0; i < board.projects.length; i++) {
            if (board.projects[i].skill_name.includes(event.target.value))
              found = true;
          }
          return found;
        });

        filtered_boards.map(board => {
          board.projects = board.projects.filter(proj => {
            return proj.skill_name.includes(event.target.value);
          });
          return board;
        });

        this.setState({
          filtered_boards,
          expand_all_boards: true
        });
      }
    }
  };

  clearSearch = () => {
    this.setState({
      filtered_boards: null,
      expand_all_boards: false
    })
  };

  lookupUserById = () => {
    this.props.findCreator(this.state.user_id);
  };

  renderBoards = () => {
    if (this.props.boards.length > 0) {
      let displayBoards = this.props.boards;
      if (this.state.filtered_boards)
        displayBoards = this.state.filtered_boards;
      return displayBoards.map(board => {
        return <TeamSummary
          board={board}
          key={board.team_id}
          expand_all={this.state.expand_all_boards}
        />
      })
    } else {
      return null;
    }
  };

  render() {
    return (
      <div>
        <div className="row internalIdSearchHeader">
          <div className={'internalIdSearchField'}>
            <h5>Find User by Id or Email</h5>
            <div>
              <Input name={"user_id"} value={this.state.user_id} onChange={this.handleChange}
                     placeholder={'Enter a user id or email'} onKeyDown={e => {
                if (e.key === 'Enter')
                  this.lookupUserById();
              }}/>
            </div>
            <div className={'internalIdSearchButton'}>
              <Button
                color={"primary"}
                className={"w-30"}
                isPrimarySmall
                onClick={this.lookupUserById}>
                Search
              </Button>
            </div>
            <div className={'filter_skill'}>
              Filter by skill name:
              <Input
                id="skill_filter_input"
                name={"skill_filter"}
                value={this.state.skill_filter}
                onChange={this.handleChange}
                placeholder={'Enter a skill name'}/>
            </div>
          </div>
          <div className="internalIdSearchUserResult">
            {this.props.creator.creator_id ? <UserCard/> : null}
          </div>
        </div>

        <div className="internalIdSearchResults">
          {this.props.boards.length > 0 ? <h4>Boards:</h4> : null }
          <div>
            {this.renderBoards()}
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  creator: state.admin.creator,
  boards: state.admin.boards,
  errorMessage: state.admin.errorMessage
});

export default connect(mapStateToProps, {findCreator})(InternalLookup);
