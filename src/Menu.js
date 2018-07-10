import React, { Component } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
    render() {
        return (
            <div className='Menu'>
                <button onClick={this.props.onSerialize}>Save</button>
                {this.props.items.map((item, i) => {
                    return <MenuItem key={i} item={item} />;
                })}
            </div>
        );
    }
}

export default Menu;
