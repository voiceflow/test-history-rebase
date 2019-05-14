import cn from 'classnames'
import React, { Component } from 'react';
import _ from 'lodash';
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd/lib/cjs/index'
import Select from 'react-select';
import {Collapse} from 'reactstrap';
import memoizeOne from 'memoize-one'

import { VOICES } from 'Constants'

import Button from 'components/Button'
import VariableText from './VariableText';
import AudioDrop from 'components/Uploads/AudioDrop'

const getBoundingRect = component => memoizeOne(findDOMNode(component).getBoundingClientRect())

const style = {
    backgroundColor: 'white',
    cursor: 'move',
    padding: '5px',
}
const source = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    }
}

const target = {
    hover(props, monitor, component){
        if (!component) {
            return null;
        }
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index
        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = getBoundingRect(component)
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        const clientOffset = monitor.getClientOffset()

        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        console.log(hoverMiddleY);
        console.log(hoverClientY);
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        props.reorder(dragIndex, hoverIndex)
        monitor.getItem().index = hoverIndex
    }
}

class SpeakElement extends Component {
    render() {
        const i = this.props.index
        const {
            isDragging,
            connectDragSource,
            connectDropTarget,
            d,
            properties,
        } = this.props
        const opacity = isDragging ? 0 : 1
        if (d.audio !== undefined){
            return connectDragSource(
                connectDropTarget(
                <div key={d.index} className="multiline" style={Object.assign({}, style, { opacity })}>
                <div className="multi-title-block">
                    <div className="multi-title" onClick={() =>this.props.toggleOpen()}>
                        <span className="text-muted">
                            <i className={cn('fas', {
                                'fa-caret-down': d.open,
                                'fa-caret-right': !d.open
                            })} />
                            {properties.randomize ? <i className="far fa-random" /> : (i + 1)}
                        </span>
                    </div>
                    <div className="overflow-ellipsis flex-1 mr-2">
                      <img src={'/volume-red.svg'} alt="speak" className="mr-3"/>
                      {d.audio ? d.audio.split('/').pop() : 'Audio'}
                    </div>
                    <Button isClose onClick={() => { this.props.handleRemoveBlock(i) }} />
                </div>
                <Collapse isOpen={d.open} className="speak-audio">
                    <div className="pb-2">
                        <AudioDrop
                            audio={d.audio}
                            update={(audio) => {
                                d.audio = audio
                                this.props.onUpdate()
                            }}
                        />
                    </div>
                </Collapse>
                <hr className="mt-2" />
            </div>
            ))
        } else {
            return connectDragSource(
                connectDropTarget(
                    <div key={d.index} className="multiline" style={Object.assign({}, style, { opacity })}>
                <div className="multi-title-block mb-2">
                    <div className="multi-title">
                        <span className="text-muted" onClick={() => this.props.toggleOpen()}>
                            <i className={cn('fas', {
                                'fa-caret-down': d.open,
                                'fa-caret-right': !d.open
                            })} />
                            {properties.randomize ? <i className="far fa-random" /> : (i + 1)}
                        </span>
                    </div>
                    <div className="super-center flex-hard mr-2">
                    <img src={'/comment-blue.svg'} alt="comment" /><div className="mx-3">Speaking as</div>
                                    <Select
                            className="speak-box"
                            classNamePrefix="select-box"
                            value={{ label: d.voice, value: d.voice }}
                            onChange={(selected) => {
                                d.voice = selected.value;
                                this.props.onUpdate()
                                if (localStorage.getItem('recent_speak')) {
                                    let recent_speaks = JSON.parse(localStorage.getItem('recent_speak'))
                                    if (!recent_speaks instanceof Array) recent_speaks = [recent_speaks]
                                    let idx = _.findIndex(recent_speaks, s => s.value === selected.value)
                                    if (idx === -1) {
                                        recent_speaks.push(selected)
                                        if (recent_speaks.length > 3) {
                                            recent_speaks.shift()
                                        }
                                        localStorage.setItem('recent_speak', JSON.stringify(recent_speaks))
                                    }
                                } else {
                                    localStorage.setItem('recent_speak', JSON.stringify([selected]))
                                }
                            }}
                            // options={VOICES}
                            options={localStorage.getItem('recent_speak') ? [{ label: 'Recent', options: JSON.parse(localStorage.getItem('recent_speak')) }].concat(VOICES) : VOICES}
                        />
                    </div>
                    <Button isClose onClick={() => { this.props.handleRemoveBlock(i) }} />
                </div>
                <Collapse isOpen={d.open}>
                    <VariableText
                        className="editor form-control auto-height"
                        raw={d.rawContent}
                        placeholder={<React.Fragment>{`Tell ${d.voice} what to say`}</React.Fragment>}
                        variables={this.props.variables}
                        updateRaw={(raw) => { d.rawContent = raw; this.props.onUpdate() }}
                    />
                    <small className="text-muted pb-3 pt-2 d-block">{'Press "{" to add variables'}</small>
                </Collapse>
                <hr />
            </div>
        ))
        }
    }
}

export default DropTarget("speak", target, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource("speak", source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    result: monitor.getDropResult(),
  }))(SpeakElement)
);
