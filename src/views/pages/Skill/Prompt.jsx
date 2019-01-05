import React, { PureComponent } from 'react'
import { VOICES } from './../Canvas/Constants'
import AudioDrop from '../../components/Uploads/AudioDrop'
import Textarea from 'react-textarea-autosize'
import Select from 'react-select'
import {Button, ButtonGroup} from 'reactstrap'
import {clone} from 'lodash'

const TABS = ['text', 'audio']

class Prompt extends PureComponent {
    constructor(props){
        super(props)

        this.state={
            tab: this.props.voice === 'audio' ? 'audio' : 'text'
        }

        this.selectVoice = this.selectVoice.bind(this)
        this.updateContent = this.updateContent.bind(this)
        this.renderTab = this.renderTab.bind(this)
        this.switchTab = this.switchTab.bind(this)
        this.local_save = null
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            })

            let copy = clone(this.local_save)
            this.local_save = {
                voice: this.props.voice,
                content: this.props.content
            }

            if(copy){
                this.props.updatePrompt(copy)
            }else{
                this.props.updatePrompt({
                    voice: tab === 'audio' ? 'audio' : 'Alexa',
                    content: ''
                })
            }
        }
    }

    updateContent(content){
        this.props.updatePrompt({
            content: content
        })
    }

    selectVoice(selected){
        this.props.updatePrompt({
            voice: selected.value
        })
    }

    renderTab(){
        if(this.props.voice === 'audio'){
            return <div className="multiline mb-3">
                <div className="mb-3">
                    <AudioDrop
                        audio={this.props.content}
                        update={this.updateContent}
                    />
                </div>
            </div>
        }else{
            return <div className="multiline">
                <div className="multi-title-block mb-2">
                    <div className="super-center flex-hard">
                        <b>Speak As</b>
                        <Select
                            className="speak-box"
                            classNamePrefix="select-box"
                            value={{label: this.props.voice, value: this.props.voice}}
                            onChange={this.selectVoice}
                            options={VOICES}
                        />
                    </div>
                </div>
                <Textarea
                    minRows={3}
                    placeholder={this.props.placeholder}
                    className="form-control"
                    value={this.props.content}
                    onChange={(e)=>this.updateContent(e.target.value)}
                />
            </div>
        }
    }

    render(){
        return (<div>
            <ButtonGroup className="toggle-group mb-2">
                {TABS.map(tab => {
                    return <Button
                        key={tab}
                        onClick={() => this.switchTab(tab)}
                        outline={this.state.tab !== tab}
                        disabled={this.state.tab === tab}>
                        {tab}
                    </Button>
                })}
            </ButtonGroup>
            {this.renderTab()}
        </div>)
    }
}

export default Prompt