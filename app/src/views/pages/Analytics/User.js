import React, { Component } from 'react';
// import moment from 'moment'
import { Alert } from 'reactstrap';
import 'react-table/react-table.css'
import ReactChartkick, { LineChart } from 'react-chartkick'
import Chart from 'chart.js'

import $ from 'jquery';

import './Analytics.css';

ReactChartkick.addAdapter(Chart);

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            stories: null,
            error: false
        }
    }

    componentDidMount() {
        this.getUserStories(this.props.env);
    }

    getUserStories(env) {
        let url = '/analytics/' + env + '/user/' + this.props.id + '/stories';
        $.ajax({
            url: url,
            type: 'GET',
            success: stories => {
                this.setState({
                    stories: stories,
                    loading: false
                });
            },
            error: () => {
                this.setState({
                    loading: false,
                    error: "Couldn't Load User Stories History"
                });
            }
        });
    }

    // <Table>
    //     <thead>
    //       <tr>
    //         <th>Title</th>
    //         <th>Number of Times Read</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //         {this.state.stories ? this.state.stories.map((story) => {
    //             return <tr><td>{story.title}</td><td>{story.count}</td></tr>
    //         })
    //         : null}
    //     </tbody>
    // </Table>
    render() {
        return (
            <div className="p-4" style={{backgroundColor: '#C8E6C9'}}>
                {this.state.loading ? <div className="text-center"><h1><i className="fas fa-sync-alt fa-spin"></i></h1></div> :
                    <div>
                        {this.state.error ? <Alert color="danger">{this.state.error}</Alert> :
                            <div>
                                <div>
                                    <b>Stories Read</b>
                                    {(this.state.stories && this.state.stories.length > 0) ? this.state.stories.map((story, i) => {
                                        return <div key={i}>{story.title}: {story.count}</div>
                                    })
                                    : <div><i>No Stories Read at all :(</i></div>}
                                </div>
                                <hr/>
                                <LineChart data={'/analytics/' + this.props.env + '/user/' + this.props.id + '/stories/data'} xtitle="Time" ytitle="Stories Started"/>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default User;
