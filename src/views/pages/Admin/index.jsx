import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Admin.css';
import Home from './Home';
import Copy from './Copy';

import {ButtonGroup} from 'reactstrap'

const tabs = [
    {
        display: <React.Fragment><i className="fal fa-home"/> Home</React.Fragment>,
        match: ['default'],
        link: '/admin'
    },
    {
        display: <React.Fragment><i className="fal fa-copy"/> Copy</React.Fragment>,
        match: ['copy'],
        link: '/admin/copy'
    }
]

class Admin extends Component {

    render() {
        let page;
        switch(this.props.page){
            case 'copy':
                page = <Copy {...this.props}/>
                break;
            default:
                page = <Home user={this.props.user}/>
        }

        return (
            <div className="admin Window">
                <div md="3" className="sidebar">
                    <div className="title">
                        Tools
                    </div>
                    <ButtonGroup vertical>
                        {tabs.map((tab, i) => {
                            if(tab.match.includes(this.props.page)){
                                return <div key={i} className="active-btn">
                                    {tab.display}
                                </div>
                            }else{
                                return <Link key={i} to={tab.link} className="inactive-btn">
                                    {tab.display}
                                </Link>
                            }
                        })}
                    </ButtonGroup>
                </div>
                <div md="9" className="admin-page">
                    {page}
                </div>
            </div>
        )
    }
}

export default Admin;
