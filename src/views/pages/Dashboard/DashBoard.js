import React, { Component } from 'react';
import $ from 'jquery';
import { Container } from 'reactstrap';
import ReactTable from "react-table";
import moment from 'moment'
import 'react-table/react-table.css'
import { Link } from 'react-router-dom'

import LoadingModal from './../../components/Modals/LoadingModal';

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            diagrams: [],
            loading: false,
            error: false
        }

        this.onLoad = this.onLoad.bind(this);
        this.onDeleteDiagram = this.onDeleteDiagram.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);

        this.onLoad();
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
            error: () => {
                window.alert('Error2');
            }
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading_modal: false
        });
        this.props.history.push('/storyboard');
    }

    onDeleteDiagram(id) {
        this.setState({
            loading: true,
            error: false
        });
        $.ajax({
            url: '/diagrams/'+id,
            type: 'DELETE',
            success: () => {
                this.onLoad() 
            },
            error: () => {
                this.setState({ error: "Unable to Delete" });
            }
        });
    }

    render() {
        return (
            <div className='App padding'>
                <LoadingModal open={this.state.loading} error={this.state.error} dismiss={this.dismissLoadingModal}/>
                <Container className="mt-5">
                    <div>
                        <h1>My Drafts</h1>
                        { Array.isArray(this.state.diagrams) ?
                        <ReactTable
                            defaultPageSize={10}
                            showPageSizeOptions={false}
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
                                    return <button className="btn btn-outline-primary" onClick={() => this.onFeatureStaging(row.value)}>Submit</button>
                                },
                                sortable: false
                            }]} 
                        /> : null }
                    </div>
                    <div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default DashBoard;
