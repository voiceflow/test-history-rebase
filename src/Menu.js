import React, { Component } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
    render() {
        return (
            <div className='Menu'>
                {this.props.items.map((item, i) => {
                    return <MenuItem key={i} item={item} />;
                })}
            </div>
        );
    }
}

export default Menu;
