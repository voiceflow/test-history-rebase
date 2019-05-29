import React from 'react';
import axios from 'axios';
import {Input} from 'reactstrap';
import Button from 'components/Button';
import _ from 'lodash';

import './InternalLookup.css';
import TeamSummary from "../TeamSummary/TeamSummary";
import UserCard from "../UserCard/UserCard";

class InternalLookup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user_id: '',
      loading: false,
      user: null,
      boards: null,
      skill_filter: '',
      filtered_boards: null,
      expand_all_boards: false,
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    if (event.target.name === 'skill_filter') {
      if (event.target.value === '') {
        this.clearSearch();
      } else {
        let filtered_boards = _.cloneDeep(this.state.boards);
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
    if (!this.state.user_id) {
      return;
    }
    if (isNaN(this.state.user_id)) {
      this.setState({loading: true});
      axios.get(`/admin-api/email/${this.state.user_id}`)
        .then(res => {
          this.setState({
            user: res.data.creator,
            boards: _.values(res.data.boards)
          })
        })
        .catch(err => console.error('Error when getting user information: ', err));
    } else {
      this.setState({loading: true});
      axios.get(`/admin-api/${this.state.user_id}`)
        .then(res => {
          this.setState({
            user: res.data.creator,
            boards: _.values(res.data.boards)
          })
        })
        .catch(err => console.error('Error when getting user information: ', err));
    }
  };

  renderBoards = () => {
    if (this.state.boards) {
      let displayboards = this.state.boards;
      if (this.state.filtered_boards)
        displayboards = this.state.filtered_boards;
      return displayboards.map(board => {
        return <TeamSummary
          board={board}
          key={board.team_id}
          user={this.props.user}
          searched_user={this.state.user}
          expand_all={this.state.expand_all_boards}
        />
      })
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
              <Button color={"primary"} className={"w-30"} isPrimarySmall
                      onClick={this.lookupUserById}>
                Search
              </Button>
            </div>
            <div className={'filter_skill'}>
              Filter by skill name: <Input name={"skill_filter"} value={this.state.skill_filter}
                                           onChange={this.handleChange}
                                           placeholder={'Enter a skill name'}/>
            </div>
          </div>
          <div className="internalIdSearchUserResult">
            <UserCard user={this.state.user}/>
          </div>
        </div>

        <div className="internalIdSearchResults">
          <h4>Boards:</h4>
          <div>
            {this.state.boards ? this.renderBoards() : null}
          </div>
        </div>
      </div>
    )
  }

}

export default InternalLookup;
