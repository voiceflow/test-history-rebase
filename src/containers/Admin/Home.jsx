import React, {Component} from 'react';
import {connect} from 'react-redux';
import InternalLookup from "./components/InternalLookup/InternalLookup";


class Home extends Component {

	render() {

		return (
			<div className="admin-page-inner">
				<div className="subheader">
					<div className="space-between">
			            <span className="subheader-title">
			              <b>Home</b>
			              <div className="hr-label">
			                <small><i className="far fa-user mr-1"></i></small>
				              {' '}
				              {this.props.user.name}{' '}
				              <small><i className="far fa-chevron-right"/></small>
				              {' '}
				              <span className="text-secondary">Admin</span>
			              </div>
			            </span>
					</div>
				</div>
				<div className="p-5">

					 {/*Admin Header*/}
					<div>
						<h3><span className={'crossed_out'}>Tyler's</span>
							&nbsp; Will's Lookup Emporium <span className={'admin_highlight'}>New and improved!</span>
						</h3>
					</div>

					<InternalLookup />

				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.account
});

export default connect(mapStateToProps)(Home);
