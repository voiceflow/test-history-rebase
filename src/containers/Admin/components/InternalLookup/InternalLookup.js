import React from 'react';
import axios from 'axios';
import {Input, Button} from 'reactstrap';
import _ from 'lodash';

import './InternalLookup.css';
import TeamSummary from "../TeamSummary/TeamSummary";

class InternalLookup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user_id: '2',
			user_email: '',
			loading: false,
			user: null,
			boards: null
		}
	}

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	};

	lookupUserById = () => {
		if (!this.state.user_id) {
			return;
		}
		this.setState({loading: true});
		axios.get(`/admin/${this.state.user_id}`)
			.then(res => {
				console.log('response data: ', res.data);
				this.setState({
					user: res.data.userDetails,
					boards: _.values(res.data.boards)
				})
			})
			.catch(err => console.error('Error when getting user information: ', err));
	};

	renderUser = () => {
		if (this.state.user) {
			const {user} = this.state;
			return (
				<div>
					<h5>{user.name}</h5>
					<div className="internalIdUserDetails">
						<p>email: {user.email}</p>
						<p>admin level: {user.admin}</p>
						<p>created: {user.created}</p>
						<p>subscription: {user.subscription ? user.subscription : 'No subscription active'}</p>
						<p>stripe id: {user.strip_id ? user.strip_id : 'No Stripe Id'}</p>
					</div>
				</div>
			)
		} else {
			return <div>No users have been searched / found</div>
		}
	};

	renderBoards = () => {
		console.log('printing boards: ', this.state.boards);
		if (this.state.boards) {
			return this.state.boards.map(board => {
				return <TeamSummary board={board} key={board.team_id} />
			})
		}

	};

	render() {
		return (
			<div>
				<div className="row internalIdSearchHeader">
					<div className={'internalIdSearchField'}>
						<h5>Find User by Id</h5>
						<div>
							<Input name={"user_id"} value={this.state.user_id} onChange={this.handleChange}
							       placeholder={'Enter the User ID, e.g. 2432'}/>
						</div>
						<Button color={"primary"} className={"w-30 internalIdSearchButton"} size={'sm'}
						        onClick={this.lookupUserById}>
							Search
						</Button>
					</div>
					<div className="internalIdSearchUserResult">
						<h4 className="internalIdSearchLabel">Fetched User:</h4>
						{this.renderUser()}
					</div>
				</div>

				<div className="internalIdSearchResults">
					<h4>Results:</h4>
					<div>
						{this.state.boards ? this.renderBoards() : null}
					</div>
				</div>


				<hr/>
			</div>
		)
	}

}

export default InternalLookup;