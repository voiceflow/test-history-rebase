import React, { Component } from 'react';
import moment from 'moment'
import 'react-table/react-table.css'
import { Link } from 'react-router-dom'

import EnvironmentModal from './EnvironmentModal'

import './DashBoard.css';

import axios from 'axios';

import ConfirmModal from './../../components/Modals/ConfirmModal';

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirm: false,
            loading: false,
            diagrams: []
        }

        this.onLoadDiagrams = this.onLoadDiagrams.bind(this);
    }

    componentDidMount() {
        this.onLoadDiagrams();
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

    onLoadDiagrams() {
        axios.get('/diagrams?verbose=true')
        .then(res => {
            this.setState({
                diagrams: res.data,
                loading: false
            });
        })
        .catch( error => {
            console.log(error);
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
                    axios.delete('/diagram/'+id)
                    .then(res => {
                        this.onLoad();
                    })
                    .catch(error => {
                        this.setState({ error: "Unable to Delete" });
                    });
                }
            }
        });
    }

    toggleConfirm() {
        this.setState({
            confirm: null
        });
    }

    render() {
        return (
            <div className='Window'>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
            </div>
        );
    }
}

export default DashBoard;
