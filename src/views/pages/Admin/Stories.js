import React, { Component } from 'react';
import $ from 'jquery';

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
            <div className='Stories content'>
                <div className='environment'>
                    <p>Staging</p>
                    <ul>
                        {Array.isArray(this.state.staging) ? this.state.staging.map(story => {
                            return <li key={story.id} style={{ fontWeight: story.featured ? 'bold' : 'normal' }}>
                                {story.title ? story.title : story.id}
                                <button onClick={() => this.onRemoveStaging(story.id)}>Remove</button>
                                <button onClick={() => this.onFeatureStaging(story.id)}>Feature</button>
                            </li>;
                        }) : null}
                    </ul>
                </div>
                <div className='environment'>
                    <p>Production</p>
                    <ul>
                        {Array.isArray(this.state.production) ? this.state.production.map(story => {
                            return <li key={story.id} style={{ fontWeight: story.featured ? 'bold' : 'normal' }}>
                                {story.title ? story.title : story.id}
                                <button onClick={() => this.onRemoveProduction(story.id)}>Remove</button>
                                <button onClick={() => this.onFeatureProduction(story.id)}>Feature</button>
                            </li>;
                        }) : null}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Stories;
