import React, { Component } from 'react';
import Stories from './Stories';
// import Errors from './Errors';
import { Col } from 'reactstrap';
import Scrollspy from 'react-scrollspy'
import 'react-table/react-table.css'
import './Admin.css';

// import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selection: 'stories',
            confirm: false
        };

        this.confirmUpdate = this.confirmUpdate.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
    }

    confirmUpdate(child_confirm) {
        this.setState({
            confirm: {
                text: child_confirm.text,
                confirm: () => {
                    this.setState({confirm: false});
                    child_confirm.confirm();
                }
            }
        });
    }

    toggleConfirm() {
        this.setState({
            confirm: false
        });
    }

    render() {
        return (
            <div className='Window' id="reviews">
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div id="dash-nav-container" className="d-none d-lg-block">
                    <nav id="dash-nav" className="navbar navbar-light bg-light flex-column p-3">
                        <Scrollspy items={ ['staging', 'storyflow', 'sandbox', 'kids'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#staging">Staging</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#storyflow">Storyflow</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#sandbox">Sandbox</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#kids">Kids</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>   
                <div className="mx-0 w-100 d-flex Left-Padding">
                    <Col>
                        <div className="Container mb-5 px-md-5">
                            <Stories onConfirmUpdate={this.confirmUpdate}/>
                        </div>
                    </Col>
                </div>
            </div>
        );
    }
}

export default Admin;
