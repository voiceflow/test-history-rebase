import React, { Component } from 'react';
import { Row, Col, Card, CardDeck, CardTitle, CardBody} from 'reactstrap';
import ReactTable from "react-table";
import moment from 'moment'
import 'react-table/react-table.css'
import Scrollspy from 'react-scrollspy'
import CountUp from 'react-countup';

import $ from 'jquery';

import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';

class Analytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            success: false,
            confirm: false,
            stories: [],
            aggregate: null
        }

        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
    }

    componentDidMount() {
        this.getStories('production');
        this.getAggregate('production');
    }

    getStories(env){
        $.ajax({
            url: '/analytics/' + env + '/stories',
            type: 'GET',
            success: stories => {
                this.setState({
                    stories: stories
                });
            },
            error: () => {
                window.alert('Error');
            }
        });
    }

    getAggregate(env){
        $.ajax({
            url: '/analytics/' + env + '/aggregate',
            type: 'GET',
            success: res => {
                this.setState({
                    aggregate: {
                        users: parseInt(res.users, 10),
                        sessions: parseInt(res.sessions, 10),
                        utterances: parseInt(res.utterances, 10),
                        started: parseInt(res.started, 10),
                        finished: parseInt(res.finished, 10)
                    }
                });
            },
            error: () => {
                window.alert('Error');
            }
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading: false
        });
    }

    toggleConfirm() {
        this.setState({
            confirm: false
        });
    }

    render() {
        return (
            <div className='Window split-page'>
                <LoadingModal open={this.state.loading} error={this.state.error} dismiss={this.dismissLoadingModal} success={this.state.success}/>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div id="dash-nav-container" className="d-none d-lg-block">
                    <nav id="dash-nav" className="navbar navbar-light bg-light flex-column p-3">
                        <Scrollspy items={ ['diagrams', 'reviews'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#diagrams">Drafts</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#reviews">Review</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>
                <Row className="mx-0 w-100 px-md-5 pt-5">
                    <Col xs="12">
                        <h1>How are we doing?</h1>
                        <hr/>
                        <CardDeck>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.users} /> : 0}</h1>
                              <CardTitle>Users</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.utterances} /> : 0}</h1>
                              <CardTitle>Utterances</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.sessions} /> : 0}</h1>
                              <CardTitle>Sessions</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.started} /> : 0}</h1>
                              <CardTitle>Stories Started</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.finished} /> : 0}</h1>
                              <CardTitle>Stories Finished</CardTitle>
                            </CardBody>
                          </Card>
                        </CardDeck>
                        <hr/>
                    </Col>
                    <Col>
                        <h1>Story Analytics</h1>
                            { Array.isArray(this.state.stories) ?
                            <ReactTable
                                defaultPageSize={10}
                                showPageSizeOptions={false}
                                className="-highlight -striped mt-4"
                                data= {this.state.stories}
                                columns= {[{
                                    Header: "Title",
                                    accessor: "title",
                                    className: "pl-3",
                                }, {
                                    Header: "Starts",
                                    accessor: "count",
                                    minWidth: 200
                                }, {
                                    Header: "Completion",
                                    accessor: "completion",
                                    minWidth: 200
                                }]} 
                            /> : null }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Analytics;
