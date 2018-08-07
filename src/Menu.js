import React, { Component } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        $.ajax({
            url: '/me',
            type: 'GET',
            success: res => {
                this.setState({
                    user: res
                });
            },
            error: () =>
                this.setState({
                    user: null
                });
            }
        });
    }

    render() {
        return (
            <div className='Menu'>
                <div className='navbar'>
                    <img className='logo' src={process.env.PUBLIC_URL+'/logo.png'} alt='logo' />
                    <p className='user'>{this.state.user || 'Not logged in'}&nbsp;&nbsp;|&nbsp;&nbsp;<a href='/logout'>Log out</a></p>
                </div>
                <div className='sidebar'>
                    <button onClick={this.props.onSave}>Save</button>
                    <button onClick={this.props.onLoad}>Load</button>
                    <button onClick={this.props.onTest}>Test</button>
                    <button onClick={this.props.onPublish}>Publish</button>
                    {this.props.items.map((item, i) => {
                        return <MenuItem key={i} item={item} />;
                    })}
                </div>
            </div>
        );
    }
}

export default Menu;
