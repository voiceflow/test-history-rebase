import React, {Component} from 'react'
import Select from 'react-select'
import { getBlocks } from './Blocks'

class Spotlight extends Component {
    constructor(props){
        super(props)

        this.state = {
            blocks: getBlocks()
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