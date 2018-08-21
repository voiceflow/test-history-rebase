import React, { Component } from 'react';
import Stories from './Stories';
import Errors from './Errors';
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
            <div className='App padding'>
                <Container>
                    {this.getContent()}
                </Container>
            </div>
        );
    }
}

export default Admin;
