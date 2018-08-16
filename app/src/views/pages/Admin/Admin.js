import React, { Component } from 'react';
import Stories from './Stories';
import Errors from './Errors';
import NavBar from './../../components/NavBar/NavBar'

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selection: 'stories'
        };
    }

    getContent() {
        switch (this.state.selection) {
        case 'stories':
            return <Stories />;
        case 'errors':
            return <Errors />;
        default:
            return null;
        }
    }

    render() {
        return (
            <div className='App' history={this.props.history}>
                <NavBar name={this.props.name} padding/>
                {this.getContent()}
            </div>
        );
    }
}

export default Admin;
