import React, {Component} from 'react'
import _ from 'lodash'
import Select from 'react-select'
import { getBlocks } from './Blocks'

const premiums = ['permission', 'permissions', 'mail', 'link_account', 'payment', 'cancel', 'reminder'];
class Spotlight extends Component {
    constructor(props){
        super(props)

        this.state = {
            blocks: window.user_detail.admin > 0 ? getBlocks() : _.filter(getBlocks(), b => !_.includes(premiums, b.type))
        }
    }

    render() {
        return <div id="spotlight">
            <Select
                onBlur={this.props.cancel}
                autoFocus
                classNamePrefix='spotlight'
                onChange={(selected) => this.props.addBlock(selected.value)}
                options={this.state.blocks.map(block => ({
                    label: block.text,
                    value: block.type
                }))}
                maxMenuHeight={124}
                value={null}
                placeholder="Add Block"
                filterOption={(value, input) => {
                    return value.value.toLowerCase().startsWith(input.toLowerCase().trim())
                }}
            />
        </div>
    }
}

export default Spotlight;