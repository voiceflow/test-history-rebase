import React, { Component } from 'react';
import $ from 'jquery';
import { Row, Col } from 'reactstrap';
import ReactTable from "react-table";

class Stories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            staging: [],
            production: [],
            sandbox: []
        };

        this.refresh = this.refresh.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onFeature = this.onFeature.bind(this);
        this.onList = this.onList.bind(this);
        this.onUnlist = this.onUnlist.bind(this);
    }

    componentDidMount() {
        this.refresh('staging');
        this.refresh('production');
        this.refresh('sandbox');
        this.refresh('kids');
    }

    refresh(env){
        $.ajax({
            url: '/stories/' + env,
            type: 'GET',
            success: stories => {
                this.setState({
                    [env]: stories
                });
            },
            error: () => {window.alert('Error');}
        });
    }

    onRemove(env, id) {
        this.props.onConfirmUpdate({
            text: "Are you sure you want to remove this story from "+ env +"?",
            confirm: () => {
                $.ajax({
                    url: '/stories/' + env + '/' + id,
                    type: 'DELETE',
                    success: () => this.refresh(env),
                    error: () => {window.alert('Error');}
                });
            }
        });
    }

    onFeature(env, id) {
        $.ajax({
            url: '/feature/' + env + '/'+id,
            type: 'POST',
            success: () => this.refresh(env),
            error: () => {window.alert('Error');}
        });
    }

    onList(env, id){
        // console.log("FUCL");
        // console.log(env, id);
        $.ajax({
            url: '/list/' + env + '/'+id,
            type: 'POST',
            success: () => this.refresh(env),
            error: () => {window.alert('Error');}
        });
    }

    onUnlist(env, id){
        $.ajax({
            url: '/list/' + env + '/'+id,
            type: 'DELETE',
            success: () => this.refresh(env),
            error: () => {window.alert('Error');}
        });
    }

    render() {
        return (
            <div className='Stories content'>
                <Row>
                    <Col>
                        <div className='environment mt-5' id="staging">
                            <h1>Staging</h1>
                            { Array.isArray(this.state.staging) ?
                            <ReactTable
                                defaultPageSize={10}
                                showPageSizeOptions={false}
                                className="-highlight -striped mt-4"
                                data= {this.state.staging}
                                columns= {[{
                                    Header: "Featured",
                                    accessor: "featured",
                                    className: "text-center",
                                    maxWidth: 80,
                                    Cell: row => {
                                        if(row.value){
                                            return <i className="fas fa-circle text-primary"></i>
                                        }else{
                                            return <i className="fas fa-circle text-warning"></i>
                                        }
                                    }
                                }, {
                                    Header: "Title",
                                    accessor: "title",
                                    className: "pl-3",
                                    minWidth: 200
                                }, {
                                    Header: "Remove",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 80,
                                    Cell: row => {
                                        return <button className="btn btn-outline-danger border-none" onClick={() => this.onRemove("staging", row.value)}>Delete</button>
                                    },
                                    sortable: false
                                }, {
                                    Header: "Feature",
                                    className: "text-center",
                                    accessor: "id",
                                    maxWidth: 90,
                                    Cell: row => {
                                        if(row.original.featured){
                                            return <button className="btn btn-outline-danger border-none" onClick={() => this.onFeature("staging", row.value)}>Cancel</button>
                                        }else{
                                            return <button className="btn btn-outline-primary border-none" onClick={() => this.onFeature("staging", row.value)}>Feature</button>
                                        }
                                    },
                                    sortable: false
                                }]} 
                            /> : null }
                        </div>
                    </Col>
                    <Col xs="6">
                        <div className='environment mt-5' id="storyflow">
                            <h1>Storyflow</h1>
                                { Array.isArray(this.state.production) ?
                                <ReactTable
                                    defaultPageSize={10}
                                    showPageSizeOptions={false}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.production}
                                    columns= {[{
                                        Header: "Featured",
                                        accessor: "featured",
                                        className: "text-center",
                                        maxWidth: 80,
                                        Cell: row => {
                                            if(row.value){
                                                return <i className="fas fa-circle text-primary"></i>
                                            }else{
                                                return <i className="fas fa-circle text-warning"></i>
                                            }
                                        }
                                    }, {
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 80,
                                        Cell: row => {
                                            return <button className="btn btn-outline-danger border-none" onClick={() => this.onRemove("production", row.value)}>Delete</button>
                                        },
                                        sortable: false
                                    }, {
                                        Header: "Feature",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 90,
                                        Cell: row => {
                                            if(row.row.featured){
                                                return <button className="btn btn-outline-danger border-none" onClick={() => this.onFeature("production", row.value)}>Cancel</button>
                                            }else{
                                                return <button className="btn btn-outline-primary border-none" onClick={() => this.onFeature("production", row.value)}>Feature</button>
                                            }
                                        },
                                        sortable: false
                                    }]} 
                                /> : null }
                        </div>
                    </Col>
                    <Col>
                        <div className='environment mt-5' id="sandbox">
                            <h1>Sandbox</h1>
                                { Array.isArray(this.state.sandbox) ?
                                <ReactTable
                                    defaultPageSize={10}
                                    showPageSizeOptions={false}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.sandbox}
                                    columns= {[{
                                        Header: "Featured",
                                        accessor: "featured",
                                        className: "text-center",
                                        maxWidth: 80,
                                        Cell: row => {
                                            if(row.value){
                                                return <i className="fas fa-circle text-primary"></i>
                                            }else{
                                                return <i className="fas fa-circle text-warning"></i>
                                            }
                                        }
                                    }, {
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 80,
                                        Cell: row => {
                                            return <button className="btn btn-outline-danger border-none" onClick={() => this.onRemove("sandbox", row.value)}>Delete</button>
                                        },
                                        sortable: false
                                    }, {
                                        Header: "Feature",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 90,
                                        Cell: row => {
                                            if(row.row.featured){
                                                return <button className="btn btn-outline-danger border-none" onClick={() => this.onFeature("sandbox", row.value)}>Cancel</button>
                                            }else{
                                                return <button className="btn btn-outline-primary border-none" onClick={() => this.onFeature("sandbox", row.value)}>Feature</button>
                                            }
                                        },
                                        sortable: false
                                    }]} 
                                /> : null }
                        </div>
                    </Col>
                    <Col>
                        <div className='environment mt-5' id="kids">
                            <h1>Storyflow Kids</h1>
                                { Array.isArray(this.state.kids) ?
                                <ReactTable
                                    defaultPageSize={10}
                                    showPageSizeOptions={false}
                                    className="-highlight -striped mt-4"
                                    data= {this.state.kids}
                                    columns= {[{
                                        Header: "Featured",
                                        accessor: "featured",
                                        className: "text-center",
                                        maxWidth: 80,
                                        Cell: row => {
                                            if(row.value){
                                                return <i className="fas fa-circle text-primary"></i>
                                            }else{
                                                return <i className="fas fa-circle text-warning"></i>
                                            }
                                        }
                                    }, {
                                        Header: "Title",
                                        accessor: "title",
                                        className: "pl-3",
                                        minWidth: 200
                                    }, {
                                        Header: "Remove",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 80,
                                        Cell: row => {
                                            return <button className="btn btn-outline-danger border-none" onClick={() => this.onRemove("kids", row.value)}>Delete</button>
                                        },
                                        sortable: false
                                    }, {
                                        Header: "Feature",
                                        className: "text-center",
                                        accessor: "id",
                                        maxWidth: 90,
                                        Cell: row => {
                                            if(row.row.featured){
                                                return <button className="btn btn-outline-danger border-none" onClick={() => this.onFeature("kids", row.value)}>Cancel</button>
                                            }else{
                                                return <button className="btn btn-outline-primary border-none" onClick={() => this.onFeature("kids", row.value)}>Feature</button>
                                            }
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
