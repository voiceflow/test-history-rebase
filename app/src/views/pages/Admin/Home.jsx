import React, { Component } from 'react';

class Home extends Component {

    // constructor(props) {
    //     super(props);

    //     this.state = {}
    // }

    render() {
        return (
            <div className="admin-page-inner">
                <div className="subheader">
                    <div className="space-between">
                        <span className="subheader-title">
                            <b>Home</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small>{' '} 
                                {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '} 
                                <span className="text-secondary">Admin</span>
                            </div>
                        </span>
                    </div>
                </div>
                <div className="super-center w-100 h-100">
                    <img src="/admin.svg" height={400} alt="placeholder"/>
                </div>
            </div>
        )
    }
}

export default Home;
