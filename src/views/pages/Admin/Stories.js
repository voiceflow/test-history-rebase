import React, { Component } from 'react';
import $ from 'jquery';
import { Row, Col } from 'reactstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import './Admin.css';

class Stories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            staging: [],
            production: []
        };

        this.refreshStories();
    }

    scrollToBottom() {
        let s = $('.Stories');
        s.scrollTop(s.prop("scrollHeight"));
    }

    refreshStories() {
        $.ajax({
            url: '/stories/staging',
            type: 'GET',
            success: stories => {
                this.setState({
                    staging: stories
                }, this.scrollToBottom.bind(this));
            },
            error: () => {window.alert('Error');}
        });
        $.ajax({
            url: '/stories/production',
            type: 'GET',
            success: stories => {
                this.setState({
                    production: stories
                }, this.scrollToBottom.bind(this));
            },
            error: () => {window.alert('Error');}
        });
    }

    onRemoveStaging(id) {
        $.ajax({
            url: '/stories/staging/'+id,
            type: 'DELETE',
            success: this.refreshStories.bind(this),
            error: () => {window.alert('Error');}
        });
    }

    onFeatureStaging(id) {
        $.ajax({
            url: '/feature/staging/'+id,
            type: 'POST',
            success: this.refreshStories.bind(this),
            error: () => {window.alert('Error');}
        });
    }

    onRemoveProduction(id) {
        $.ajax({
            url: '/stories/production/'+id,
            type: 'DELETE',
            success: this.refreshStories.bind(this),
            error: () => {window.alert('Error');}
        });
    }

    onFeatureProduction(id) {
        $.ajax({
            url: '/feature/production/'+id,
            type: 'POST',
            success: this.refreshStories.bind(this),
            error: () => {window.alert('Error');}
        });
    }

    render() {
        return (
            <div className='Stories content mt-5'>
                <Row>
                    <Col>
                        <div className='environment'>
                            <h1>Staging</h1>
                            { Array.isArray(this.state.staging) ?
                            <ReactTable
                                defaultPageSize={10}
                                showPageSizeOptions={false}
                                className="-highlight -striped mt-4"
                                data= {this.state.staging}
                                columns= {[{
                                    Header: "Title",
                                    accessor: "title",
                                    className: "pl-3",
                                    minWidth: 200
                                }, {
                                    Header: "Featured",
                                    accessor: "featured",
                                    className: "text-center",
                                    maxWidth: 80,
                                    Cell: row => {
                                        return <small>{row.value ? <i className="fas fa-circle text-success"></i> : <i className="fas fa-circle text-warning"></i>}</small>
                                    }
                                }, {
                                    Header: "Remove",
                                    className: "text-center",
                                    accessor: "id",
                                    Cell: row => {
                                        return <button className="btn btn-danger" onClick={() => this.onRemoveStaging(row.value)}>Delete <i className="fas fa-exclamation-circle"></i></button>
                                    },
                                    sortable: false
                                }, {
                                    Header: "Feature",
                                    className: "text-center",
                                    accessor: "id",
                                    Cell: row => {
                                        return <button className="btn btn-outline-primary" onClick={() => this.onFeatureStaging(row.value)}>Feature</button>
                                    },
                                    sortable: false
                                }]} 
                            /> : null }
                        </div>
                    </Col>
                    <Col>
                        <div className='environment'>
                            <h1>Production</h1>
                                { Array.isArray(this.state.production) ?
                                <ReactTable
                                    defaultPageSize={10}
                                    showPageSizeOptions={false}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.production}
                                    columns= {[{
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Featured",
                                        accessor: "featured",
                                        className: "text-center",
                                        maxWidth: 80,
                                        Cell: row => {
                                            return <small>{row.value ? <i className="fas fa-circle text-success"></i> : <i className="fas fa-circle text-warning"></i>}</small>
                                        }
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        Cell: row => {
                                            return <button className="btn btn-danger" onClick={() => this.onRemoveProduction(row.value)}>Delete <i className="fas fa-exclamation-circle"></i></button>
                                        },
                                        sortable: false
                                    }, {
                                        Header: "Feature",
                                        className: "text-center",
                                        accessor: "id",
                                        Cell: row => {
                                            return <button className="btn btn-outline-primary" onClick={() => this.onFeatureProduction(row.value)}>Feature</button>
                                        },
                                        sortable: false
                                    }]} 
                                /> : null }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Stories;
