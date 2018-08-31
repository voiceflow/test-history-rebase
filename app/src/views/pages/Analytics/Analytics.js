import React, { Component } from 'react';
import { Row, Col, Card, CardDeck, CardTitle, CardBody} from 'reactstrap';
import ReactTable from "react-table";
import DatePicker from 'react-datepicker';
import moment from 'moment'
import 'react-table/react-table.css'
import Scrollspy from 'react-scrollspy'
import CountUp from 'react-countup';
import ReactChartkick, { LineChart } from 'react-chartkick'
import Chart from 'chart.js'

import $ from 'jquery';

import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';

import 'react-datepicker/dist/react-datepicker.css';
import './Analytics.css';

ReactChartkick.addAdapter(Chart);

class Analytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            success: false,
            confirm: false,
            stories: [],
            aggregate: null,
            startDate: moment('08302018', 'MMDDYYYY'),
            endDate: moment()
        }

        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
    }

    componentDidMount() {
        this.getStories('production');
        this.getAggregate('production');
    }

    handleStartChange(date) {
        this.setState({
          startDate: date
        });
    }

    getStories(env, start, end){
        $.ajax({
            url: '/analytics/' + env + '/stories',
            type: 'GET',
            success: stories => {
                this.setState({
                    stories: stories.map((story) => {
                        story.count = parseInt(story.count, 10); 
                        return story;
                    })
                });
            },
            error: () => {
                window.alert('Error');
            }
        });
    }

    getAggregate(env, start, end){
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
                        <Scrollspy items={ ['aggregates', 'stories'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#aggregates">Aggregates</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#stories">Stories</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>
                <Row className="mx-0 w-100">
                    <div className="date-bar px-md-5">
                        <h1>Storyflow Analytics</h1>
                        <div className="d-flex">
                            <div>
                                Start Date 
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartChange}
                                />
                            </div>
                            <div>
                                End Date 
                                <DatePicker
                                    selected={this.state.endDate}
                                    onChange={this.handleEndChange}
                                />
                            </div>
                        </div>
                    </div>
                    <Row className="px-md-5">
                    <Col xs="12" id="aggregates">
                        <h1>How are we doing?</h1>
                        <hr/>
                        <CardDeck>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.users} /> : 0}</h1>
                              <CardTitle>Total Users</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.utterances} /> : 0}</h1>
                              <CardTitle>Total Utterances</CardTitle>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.sessions} /> : 0}</h1>
                              <CardTitle>Total Sessions</CardTitle>
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
                    <Col className="mb-5" id="stories">
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
                </Row>
            </div>
        );
    }
}

export default Analytics;
