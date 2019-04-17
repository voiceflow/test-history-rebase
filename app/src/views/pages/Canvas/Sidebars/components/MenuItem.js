import cn from 'classnames'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';
import { ALLOWED_GOOGLE_BLOCKS } from 'Constants'

const MenuItem = (props) => (
    <div className="wrap" style={(!props.draggable) ? {opacity: 0.3} : null}>
        <div
            className={
                cn('MenuItem', props.item.type, {
                    'faded-node': props.platform === 'google' && !ALLOWED_GOOGLE_BLOCKS.includes(props.item.type)
                })
            }
            draggable={props.draggable}
            onDragStart={event => {
                event.stopPropagation()
                window.Appcues.track('block dragged')
                event.dataTransfer.setData('node', props.item.type);
                if(props.data){
                    event.dataTransfer.setData('data', props.data)
                }
                if(props.name){
                    event.dataTransfer.setData('name', props.name)
                }
            }}
        >
            <div className={
                cn('MenuIcon', {
                    'module-icon': props.item.type === 'symbol'
                })
            }>
                {props.item.icon}
            </div>
            <div className="MenuText">
                <span>{props.item.text}</span> 
                {props.draggable ?
                    <Tooltip 
                        html={props.item.tip}
                        className="menu-tip"
                        theme="menu"
                        position="bottom"
                    >
                        &nbsp;&nbsp;
                    </Tooltip>
                    : 
                    null
                }
            </div>
        </div>
    </div>
)

const mapStateToProps = state => ({
    platform: state.skills.skill.platform
})

export default connect(mapStateToProps)(MenuItem);
