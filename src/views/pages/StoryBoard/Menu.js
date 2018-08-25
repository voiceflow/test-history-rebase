import React, { Component } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className='Menu'>
                <div className='sidebar'>
                    <div className='blocks'>
                        <h3 className='block-title text-muted'><i className="fas fa-cube"></i></h3>
                        <hr className='mt-1'/>
                        {this.props.items.map((item, i) => {
                            if(item === 'hr'){
                                return <hr key={i}/>;
                            }else{
                                return <MenuItem key={i} item={item} />;
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;
