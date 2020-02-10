import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import UserListCard from '@/admin/components/UserListCard';
import { BetaUsersFullList, BetaUsersListSearch, BetaUsersListWrapper } from '@/admin/pages/BetaProgram/styles';
import { getBetaUsers } from '@/admin/store/ducks/admin';
import { AdminTitle } from '@/admin/styles';
import Button from '@/components/Button';
import { toast } from '@/components/Toast';

class BetaUsersList extends React.Component {
  state = {
    users: [],
    searchVal: '',
    filteredUsers: [],
  };

  componentDidMount = async () => {
    const response = await axios.get('/admin-api/flags_users/beta');
    this.setState({
      users: response.data,
    });
  };

  removeUser = async (userId) => {
    try {
      await axios.delete(`/admin-api/flags/${userId}/beta`);
      toast.success('User removed');
      const filteredUsers = this.state.users.filter((user) => user.creator_id !== userId);
      this.setState({
        users: filteredUsers,
      });
    } catch (err) {
      toast.error('Couldnt remove the user');
    }
  };

  search = (searchTerm) => {
    const term = searchTerm.target.value;
    const filteredUsers = this.state.users.filter((user) => {
      return user.email.includes(term) || user.name.includes(term);
    });
    this.setState({
      searchVal: term,
      filteredUsers,
    });
  };

  clearFilters = () => {
    this.setState({
      filteredUsers: [],
      searchVal: '',
    });
  };

  renderList = () => {
    if (this.state.searchVal) {
      return this.state.filteredUsers.map((user) => <UserListCard removeUser={this.removeUser} user={user} key={user.creator_id} />);
    }
    return this.state.users.map((user) => <UserListCard removeUser={this.removeUser} user={user} key={user.creator_id} />);
  };

  render() {
    return (
      <BetaUsersListWrapper>
        <AdminTitle>Beta Users</AdminTitle>
        <hr />
        <BetaUsersListSearch>
          <InputGroup className="search-header">
            <Input onChange={this.search} value={this.state.searchVal} placeholder="Search by Email or Name" />
            <InputGroupAddon addonType="prepend">
              <Button variant="secondary" onClick={this.clearFilters}>
                Clear
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </BetaUsersListSearch>
        <BetaUsersFullList>{this.renderList()}</BetaUsersFullList>
      </BetaUsersListWrapper>
    );
  }
}

export default connect(null, { getBetaUsers })(BetaUsersList);
