import React, { Component } from 'react'

class ReminderBlock extends Component {
    constructor(props) {
        super(props)
        this.updateReminder = this.updateReminder.bind(this)
    }

    updateReminder(e){
        let node = this.props.node
        node.extras.reminder = e.target.value
        this.forceUpdate()
    }

    render() {
        return (<div>
            <textarea placeholder="JSON Value here" onChange={this.change} value={this.props.node.extras.reminder}/>
        </div>)
    }
}

export default ReminderBlock
