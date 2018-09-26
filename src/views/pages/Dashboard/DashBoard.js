import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import ReactTable from "react-table";
import moment from 'moment'
import 'react-table/react-table.css'
import { Link } from 'react-router-dom'
import Scrollspy from 'react-scrollspy'
import EnvironmentModal from './EnvironmentModal'
import './DashBoard.css';

import $ from 'jquery';

import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';
import WorldModal from './WorldModal';

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            worlds: [],
            diagrams: [],
            reviews: [],
            loading: false,
            error: false,
            success: false,
            confirm: false,
            openEnv: false,
            id: null,
            dropdownOpen: false
        }

        this.onLoad = this.onLoad.bind(this);
        this.onLoadWorlds = this.onLoadWorlds.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.toggleEnv = this.toggleEnv.bind(this);
        this.onLoadReviews = this.onLoadReviews.bind(this);
        this.onDeleteDiagram = this.onDeleteDiagram.bind(this);
        this.onDeleteWorld = this.onDeleteWorld.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.onSubmitDiagram = this.onSubmitDiagram.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    componentDidMount() {
        this.onLoad();
        this.onLoadReviews();
        this.onLoadWorlds();
    }

    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleEnv() {
        this.setState({
            openEnv: !this.state.openEnv
        })
    }

    onLoad() {
        $.ajax({
            url: '/diagrams?verbose=true',
            type: 'GET',
            success: data => {
                this.setState({
                    diagrams: data,
                    loading: false
                });
            },
            error: (e) => {
                console.log(e);
                window.alert('Error22');
            }
        });
    }

    onLoadWorlds() {
        $.ajax({
            url: '/worlds',
            type: 'GET',
            success: data => {
                this.setState({
                    worlds: data,
                    loading: false
                });
            },
            error: (e) => {
                console.log(e);
                window.alert('Error22');
            }
        });
    }

    onLoadReviews(stop_load) {
        $.ajax({
            url: '/reviews',
            type: 'GET',
            success: data => {
                this.setState({
                    reviews: data
                });
                if(stop_load){
                    this.setState({ loading: false });
                }
            },
            error: (e) => {
                console.log("reviews");
                console.log(e);
                window.alert('Error33');
            }
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading: false
        });
    }

    onDeleteDiagram(id) {
        this.setState({
            confirm: {
                text: "Are you sure you want to delete this diagram? Diagrams can not be recovered",
                confirm: () => {
                    this.setState({
                        loading: true,
                        error: false,
                        success: false,
                        confirm: false
                    });
                    $.ajax({
                        url: '/diagram/'+id,
                        type: 'DELETE',
                        success: () => {
                            this.onLoad();
                        },
                        error: (e) => {
                            this.setState({ error: "Unable to Delete" });
                        }
                    });
                }
            }
        });
    }

    onDeleteWorld(id) {
        this.setState({
            confirm: {
                text: <span>Are you sure you want to delete this World?<br/><br/> all stories in this world will no longer associated</span>,
                confirm: () => {
                    this.setState({
                        loading: true,
                        error: false,
                        success: false,
                        confirm: false
                    });
                    $.ajax({
                        url: '/world/'+id,
                        type: 'DELETE',
                        success: () => {
                            this.onLoadWorlds();
                        },
                        error: (e) => {
                            this.setState({ error: "Unable to Delete" });
                        }
                    });
                }
            }
        });
    }

    onDeleteReview(id) {
        this.setState({
            confirm: {
                text: "Are you sure you want to remove this Review?",
                confirm: () => {
                    this.setState({
                        error: false,
                        success: false,
                        loading: true,
                        confirm: false
                    });
                    $.ajax({
                        url: '/review/'+id,
                        type: 'DELETE',
                        success: () => {
                            this.onLoadReviews(true);
                        },
                        error: (e) => {
                            console.log(e);
                            if(e.status === 409){
                                this.setState({ error: "Can't remove while being reviewed" });
                            }else{
                                this.setState({ error: "Unable to Remove" });
                            }
                        }
                    });
                }
            }
        });
    }


    onSubmitDiagram(env) {
        let id = this.state.id;
        if(!id) return;
        this.setState({
            loading: true,
            error: false,
            success: false,
            openEnv: false,
            id: null
        });
        $.ajax({
            url: '/review/'+id,
            type: 'POST',
            data: {
                envs: env
            },
            success: () => {
                this.setState({ success: "Your story has been successfully sent for review!" });
                this.onLoadReviews();
            },
            error: (e) => {
                console.log(e);
                if(e.status === 409){
                    this.setState({ error: "Already Submitted for Review" });
                }else{
                    this.setState({ error: "Unable to Submit" });
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
            <div className='Window'>
                <LoadingModal open={this.state.loading} error={this.state.error} dismiss={this.dismissLoadingModal} success={this.state.success}/>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <EnvironmentModal open={this.state.openEnv} toggle={this.toggleEnv} handleConfirm={this.onSubmitDiagram}/>
                <div id="dash-nav-container" className="d-none d-lg-block">
                    <nav id="dash-nav" className="navbar navbar-light bg-light flex-column p-3">
                        <Scrollspy items={ ['worlds', 'diagrams', 'reviews'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#worlds">Worlds</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#diagrams">Drafts</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#reviews">Review</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>
                <Row className="mx-0 w-100 Left-Padding">
                    <Col>
                        <div className="Container my-5 px-md-3 px-lg-5">
                            <div id="worlds">
                                <h1>My Worlds</h1>
                                <hr/>
                                <WorldModal update={this.onLoadWorlds}/>
                                { Array.isArray(this.state.worlds) ?
                                <ReactTable
                                    defaultPageSize={5}
                                    className="-highlight -striped mt-4 mb-5 text-center"
                                    data= {this.state.worlds}
                                    columns= {[{
                                        Header: "World Name",
                                        accessor: "name",
                                    }, {
                                        Header: "Platform",
                                        accessor: "env",
                                    }, {
                                        Header: "Preview",
                                        accessor: "preview",
                                    }, {
                                        Header: "Stories",
                                        accessor: "stories",
                                    }, {
                                        Header: "Remove",
                                        accessor: "world_id",
                                        maxWidth: 100,
                                        Cell: row => {
                                            return <button className="btn btn-danger" onClick={() => this.onDeleteWorld(row.value)}>Delete</button>
                                        },
                                        sortable: false
                                    },]} 
                                /> : null }
                            </div>
                            <div id="diagrams">
                                <h1>My Drafts</h1>
                                { Array.isArray(this.state.diagrams) ?
                                <ReactTable
                                    defaultPageSize={5}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.diagrams}
                                    columns= {[{
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Last Modified",
                                        accessor: "last_save",
                                        maxWidth: 200,
                                        className: "text-center text-muted",
                                        Cell: row => {
                                            if(row.value){
                                                return moment(row.value).fromNow();
                                            }else{
                                                return "a long time ago";
                                            }
                                        }
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 100,
                                        Cell: row => {
                                            return <button className="btn btn-danger" onClick={() => this.onDeleteDiagram(row.value)}>Delete</button>
                                        },
                                        sortable: false
                                    },{
                                        Header: "Open",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 80,
                                        Cell: row => {
                                            return <Link to={"/storyboard/" + row.value} className="btn btn-success">Open</Link>
                                        },
                                        sortable: false
                                    }, {
                                        Header: "Review",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 90,
                                        Cell: row => {
                                            return <button className="btn btn-outline-primary" onClick={() => {this.toggleEnv(); this.setState({id: row.value})}}>Submit</button>
                                        },
                                        sortable: false
                                    }]} 
                                /> : null }
                            </div>
                            <div id="reviews" className="py-5">
                                <h1>Under Review/Published</h1>
                                { Array.isArray(this.state.reviews) ?
                                <ReactTable
                                    defaultPageSize={5}
                                    showPageSizeOptions={false}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.reviews}
                                    columns= {[{
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Status",
                                        accessor: "status",
                                        className: "pl-3 text-center",
                                        maxWidth: 200,
                                        Cell: row => {
                                            if(row.value === "submitted"){
                                                return (<span className="text-muted"><small><i className="fas fa-circle text-warning mr-1"></i></small>  Submitted</span>);
                                            }else if(row.value === "under_review"){
                                                return (<span className="text-muted"><small><i className="fas fa-circle text-primary mr-1"></i></small>  Under Review</span>);
                                            }else if(row.value === "published"){
                                                return (<span className="text-muted"><small><i className="fas fa-circle text-success mr-1"></i></small>  Published</span>);
                                            }else if(row.value === "declined"){
                                                return (<span className="text-muted"><small><i className="fas fa-circle text-danger mr-1"></i></small>  Declined</span>);
                                            }else{
                                                return (<span className="text-muted"><small><i className="fas fa-circle text-warning mr-1"></i></small>  Error</span>);
                                            }
                                        }
                                    }, {
                                        Header: "Submitted At",
                                        accessor: "submitted",
                                        maxWidth: 200,
                                        className: "text-center text-muted",
                                        Cell: row => {
                                            if(row.value){
                                                return moment(row.value).format('MMM Do YYYY, h:mm a');
                                            }else{
                                                return "a long time ago";
                                            }
                                        }
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 100,
                                        Cell: row => {
                                            return <button className="btn btn-danger" onClick={() => this.onDeleteReview(row.value)}>Cancel</button>
                                        },
                                        sortable: false
                                    }]} 
                                /> : null }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DashBoard;
