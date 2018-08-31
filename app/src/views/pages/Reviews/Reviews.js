import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import ReactTable from "react-table";
import moment from 'moment'
import 'react-table/react-table.css'
import Scrollspy from 'react-scrollspy'
import { Link } from 'react-router-dom'

import $ from 'jquery';

import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            under_reviews: [],
            confirm: false,
            loading: false,
            error: false,
            success: false
        }

        this.onLoadReviews = this.onLoadReviews.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.onDeclineReview = this.onDeclineReview.bind(this);
    }

    componentDidMount() {
        this.onLoadReviews();
    }

    onLoadReviews() {
        this.setState({
            loading: true,
            error: false
        }, () => {
            $.ajax({
                url: '/reviews?author=1',
                type: 'GET',
                success: data => {
                    let reviews = [];
                    let under_reviews = [];
                    data.forEach((review) => {
                        if(review.status==="submitted"){
                            reviews.push(review);
                        }else if(review.status==="under_review"){
                            under_reviews.push(review);
                        }
                    })
                    this.setState({
                        loading: false,
                        reviews: reviews,
                        under_reviews: under_reviews
                    });
                },
                error: () => {
                    this.setState({
                        error: "Can't load reviews"
                    });
                }
            });
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading: false
        });
    }

    onDeclineReview(id) {
        this.onConfirmUpdate({
            text: "Are you sure you want to decline this review?",
            confirm: () => {
                this.setState({
                    error: false,
                    success: false,
                    loading: true
                });
                $.ajax({
                    url: '/review/'+id,
                    type: 'PATCH',
                    data: {
                        status: "declined"
                    },
                    success: () => {
                        this.onLoadReviews(true) 
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
        });
    }


    onSubmitDiagram(id) {
        this.setState({
            loading: true,
            error: false,
            success: false
        });
        $.ajax({
            url: '/review/'+id,
            type: 'POST',
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
            <div className='Window split-page'>
                <LoadingModal open={this.state.loading} error={this.state.error} dismiss={this.dismissLoadingModal} success={this.state.success}/>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div id="dash-nav-container" className="d-none d-lg-block">
                    <nav id="dash-nav" className="navbar navbar-light bg-light flex-column p-3">
                        <Scrollspy items={ ['reviews'] } className="nav nav-pills" currentClassName="active">
                            <li className="nav-item">
                              <a className="nav-link" href="#reviews">Reviews</a>
                            </li>
                        </Scrollspy>
                    </nav>
                </div>
                <Row className="mx-0 w-100 px-md-5 pt-5">
                    <Col id="reviews">
                        <div className='environment mb-5' id="submitted">
                            <h1>Submitted For Review</h1>
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
                                    Header: "Submitted At",
                                    accessor: "submitted",
                                    maxWidth: 200,
                                    className: "text-center text-muted",
                                    Cell: row => {
                                        if(row.value){
                                            return moment(row.value).format('YYYY MM/DD HH:mm');
                                        }else{
                                            return "unknown";
                                        }
                                    }
                                }, {
                                    Header: "Decline",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 100,
                                    Cell: row => {
                                        return <button className="btn btn-outline-danger border-none" onClick={() => this.onDeclineReview(row.value)}>Decline</button>
                                    },
                                    sortable: false
                                }, {
                                    Header: "Review",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 100,
                                    Cell: row => {
                                        return <Link to={"/storyboard/review/" + row.value} className="btn btn-outline-primary border-none">Review</Link>
                                    },
                                    sortable: false
                                }]}
                                SubComponent={row => {
                                    let og = row.row._original;
                                    return (
                                      <div className="p-2 pl-4"><span className="text-muted">Author - </span> {og.name} | {og.email}</div>
                                    );
                                  }}
                            /> : null }
                        </div>
                    </Col>
                    <Col>
                        <div id="reviewing">
                            <h1>Under Review</h1>
                            { Array.isArray(this.state.under_reviews) ?
                            <ReactTable
                                defaultPageSize={5}
                                showPageSizeOptions={false}
                                className="-highlight -striped mt-4"
                                data= {this.state.under_reviews}
                                columns= {[{
                                    Header: "Title",
                                    accessor: "title",
                                    className: "pl-3",
                                    minWidth: 200
                                }, {
                                    Header: "Submitted At",
                                    accessor: "submitted",
                                    maxWidth: 200,
                                    className: "text-center text-muted",
                                    Cell: row => {
                                        if(row.value){
                                            return moment(row.value).format('YYYY MM/DD HH:mm');
                                        }else{
                                            return "unknown";
                                        }
                                    }
                                }, {
                                    Header: "Decline",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 100,
                                    Cell: row => {
                                        return <button className="btn btn-outline-danger border-none" onClick={() => this.onDeclineReview(row.value)}>Decline</button>
                                    },
                                    sortable: false
                                }, {
                                    Header: "Review",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 100,
                                    Cell: row => {
                                        return <Link to={"/storyboard/review/" + row.value} className="btn btn-outline-primary border-none">Review</Link>
                                    },
                                    sortable: false
                                }]}
                                SubComponent={row => {
                                    let og = row.row._original;
                                    return (
                                      <div className="p-2 pl-4"><span className="text-muted">Author - </span> {og.name} | {og.email}</div>
                                    );
                                  }}
                            /> : null }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Reviews;
