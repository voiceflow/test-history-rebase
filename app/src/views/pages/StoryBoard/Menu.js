import React, { Component } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='Menu'>
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
