import React, { Component } from 'react';
import Stories from './Stories';
import Errors from './Errors';
import NavBar from './../../components/NavBar/NavBar'
import { Container } from 'reactstrap';

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
                <NavBar name={this.props.name} history={this.props.history} padding/>
                <Container>
                    {this.getContent()}
                </Container>
            </div>
        );
    }
}

export default Admin;
