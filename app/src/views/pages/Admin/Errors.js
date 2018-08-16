import React, { Component } from 'react';
import $ from 'jquery';

class Errors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            staging: [],
            production: []
        };

        this.refreshErrors();
    }

    scrollToBottom() {
        let e = $('.Errors');
        e.scrollTop(e.prop("scrollHeight"));
    }

    refreshErrors() {
        $.ajax({
            url: '/errors/staging',
            type: 'GET',
            success: errors => {
                this.setState({
                    staging: errors
                }, this.scrollToBottom.bind(this));
            },
            error: () => {window.alert('Error');}
        });
        $.ajax({
            url: '/errors/production',
            type: 'GET',
            success: errors => {
                this.setState({
                    production: errors
                }, this.scrollToBottom.bind(this));
            },
            error: () => {window.alert('Error');}
        });
    }

    render() {
        return (
            <div className='Errors content'>
                <div className='environment'>
                    <p>Staging</p>
                    <ul>
                        {Array.isArray(this.state.staging) ? this.state.staging.map((error, i) => {
                            return <li key={i}>{error}</li>;
                        }) : null}
                    </ul>
                </div>
                <div className='environment'>
                    <p>Production</p>
                    <ul>
                        {Array.isArray(this.state.production) ? this.state.production.map((error, i) => {
                            return <li key={i}>{error}</li>;
                        }) : null}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Errors;
