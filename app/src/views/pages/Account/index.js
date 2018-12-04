import React, { Component } from 'react';

class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return <div className='Window'>
                <div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">
                            <b>Account</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small>{' '}
                                {this.props.user.name}{' '}
                            </div>
                        </span>
                    </div>
                </div>
                <div className="card">
                </div>
            </div>
  }
}

export default Account;
