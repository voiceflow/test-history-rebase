import React, { Component } from 'react';

import axios from 'axios'

class World extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stories: null,
            loading: true
        }
    }

    componentDidMount() {
        this.getWorldStories(this.props.world_id);
    }

    getWorldStories(id) {
        axios('/world/' + id + '/stories')
        .then(res => {
            this.setState({
                loading: false,
                stories: res.data
            });
        })
    }

    render() {
        return (
            <div className="p-4 text-left">
                {this.state.loading ? <div className="text-center"><h1><i className="fas fa-sync-alt fa-spin"></i></h1></div> :
                    <div>
                        <div>
                            <div>
                                <b>Stories in this World:</b>
                                {(this.state.stories && this.state.stories.length > 0) ? this.state.stories.map((story, i) => {
                                    return <div key={i}>{i+1}: {story.title}</div>
                                })
                                : <div><i>No Stories in this world</i></div>}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default World;
