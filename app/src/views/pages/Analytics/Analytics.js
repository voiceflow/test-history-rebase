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
import User from './User'

import $ from 'jquery';

import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';
import ClipBoard from './../../components/ClipBoard';

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
            endDate: moment(),
            env: 'production',
            data: {},
            users: []
        }

        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }

    componentDidMount() {
        this.getStories(this.state.env);
        this.getAggregate(this.state.env);
        this.getReads(this.state.env);
        this.getUsers(this.state.env);
    }

    resetForDate(){
        let start = this.state.startDate.valueOf();
        let end = this.state.endDate.valueOf();
        this.getStories(this.state.env, start, end);
        this.getReads(this.state.env, start, end);
    }

    handleStartChange(date) {
        this.setState({
          startDate: date
        }, this.resetForDate);
    }

    handleEndChange(date) {
        this.setState({
          endDate: date
        }, this.resetForDate);
    }

    getUsers(env){
        let url = '/analytics/' + env + '/users';
        $.ajax({
            url: url,
            type: 'GET',
            success: users => {
                this.setState({
                    users: users.map(user => {
                        user.finished = parseInt(user.finished, 10);
                        user.count = parseInt(user.count, 10);
                        user.completion = parseInt((user.finished*100/user.count).toFixed(0), 10);
                        return user
                    })
                });
            },
            error: () => {
                window.alert('Error');
            }
        });
    }

    getStories(env, start, end){
        let url = '/analytics/' + env + '/stories';
        if(start && end) url +=  ("/" + start + "/" + end);
        $.ajax({
            url: url,
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

    getReads(env, start, end){
        let url = '/analytics/' + env + '/reads';
        if(start && end) url +=  ("/" + start + "/" + end);
        $.ajax({
            url: url,
            type: 'GET',
            success: reads => {
                let points = {}
                reads.forEach((read) => {
                    points[read.s] = read.count
                });
                this.setState({
                    data: points
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
                        <Scrollspy items={ ['aggregates', 'reads', 'stories', 'users'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#aggregates">Aggregates</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#reads">Stories/Time</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#stories">Stories</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#users">Users</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>
                <Row className="mx-0 w-100 Left-Padding">
                    <div className="date-bar px-md-5">
                        <h1>Storyflow Analytics</h1>
                        <div className="d-flex">
                            <div className="mr-3">
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
                    <Row className="analytics-row px-md-5 m-0">
                    <Col xs="12" id="aggregates" className="mb-5">
                        <h1>How are we doing?</h1>
                        <hr/>
                        <CardDeck>
                          <Card>
                            <CardBody>
                              <h1>{this.state.aggregate ? <CountUp start={0} end={this.state.aggregate.users} /> : 0}</h1>
                              <CardTitle>Total Unique Users</CardTitle>
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
                    <Col xs="12" className="mb-5" id="reads">
                        <h1>Stories Started over Time</h1>
                        <hr/>
                        <LineChart data={this.state.data} xtitle="Time" ytitle="Stories Started" download={true} />
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
                    <Col className="mb-5" id="users" xs="12">
                        <h1>Users</h1>
                            { Array.isArray(this.state.users) ?
                            <ReactTable
                                defaultPageSize={30}
                                className="-highlight -striped mt-4"
                                data= {this.state.users}
                                columns= {[{
                                    Header: "ID",
                                    accessor: "id",
                                    className: "pl-3",
                                    maxWidth: 80
                                }, {
                                    Header: "Email",
                                    accessor: "email",
                                    Cell: row => {
                                        return <ClipBoard
                                            id={"email" + row.original.id}
                                            value={row.value}
                                        />
                                    }
                                }, {
                                    Header: "First Name",
                                    accessor: "first_name"
                                }, {
                                    Header: "Rate",
                                    accessor: "completion",
                                    className: "text-center",
                                    maxWidth: 100,
                                    style: {backgroundColor: "#C8E6C9"}
                                }, {
                                    Header: "Started",
                                    accessor: "count",
                                    className: "text-center",
                                    maxWidth: 100,
                                },{
                                    Header: "Finished",
                                    accessor: "finished",
                                    className: "text-center",
                                    maxWidth: 100,
                                }, {
                                    Header: "Sessions",
                                    accessor: "sessions",
                                    className: "text-center",
                                    maxWidth: 100
                                }, {
                                    Header: "Utterances",
                                    accessor: "utterances",
                                    className: "text-center",
                                    maxWidth: 100
                                }, {
                                    Header: "Last Story",
                                    accessor: "last_seen",
                                    className: "text-center",
                                    Cell: row => {
                                        if(row.value){
                                            return moment(row.value).fromNow();
                                        }else{
                                            return "unknown";
                                        }
                                    },
                                }, {
                                    Header: "Joined",
                                    accessor: "join_date",
                                    className: "text-center",
                                    Cell: row => {
                                        if(row.value){
                                            return moment(row.value).fromNow();
                                        }else{
                                            return "unknown";
                                        }
                                    },
                                }]}
                                SubComponent={(row) => {
                                    row = row.original;
                                    return <User
                                                id={row.user_id}
                                                env={this.state.env}
                                            />
                                }}
                            /> : null }
                    </Col>
                </Row>
                </Row>
            </div>
        );
    }
}

export default Analytics;
