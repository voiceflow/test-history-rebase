import React, { PureComponent } from 'react';
import MenuItem from './components/MenuItem';
import ModuleItem from './components/ModuleItem';
import { Button, Collapse, ButtonGroup } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';

const SECTIONS = [{
    title: 'Basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-comment"/>, tip: 'Tell Alexa to play sounds or talk to the user' },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/>, tip: 'Listen for the user to make a choice from a list of options you set'  },
        { text: 'Command', type: 'command', icon: <i className="fas fa-exclamation"/>, tip: 'Add shortcuts for your users to navigate your skill quickly'},
    ]
},{
    title: 'Logic',
    items: [
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/>, tip: 'Set the value of a variable, or many variables at once' },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>, tip: 'Set conditions that activate paths only when true' },
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/>, tip: 'Capture what the user says into a variable' },
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>, tip: 'Choose randomly from a set number of paths' },
   ]
},{
    title: 'Advanced',
    items: [
        { text: 'Intent', type: 'intent', icon: <i className="fas fa-user-alt"/>, tip: 'Intent blocks select choices and capture slot values from user input' },
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-play"/>, tip: 'Stream long audio files & URLs for the user' },
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/>, tip: 'Use external APIs and store responses into variables'  },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/>, tip: 'Organize your project into manageable sections or perform computations'},
   ]
},{
    title: 'Functional',
    items: [
        { text: 'Combine', type: 'combine', icon: <i className="fas fa-compress-alt"/>, tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit' },
        { text: 'Comment', type: 'comment', icon: <i className="fas fa-sticky-note"/>, tip: 'Add notes to your diagram'},
    ]
}]

const TABS = ['blocks', 'modules']

class Blocks extends PureComponent {
    constructor(props) {
        super(props);

        // Store state of basic + advanced tabs
        let show = localStorage.getItem('show')
        if(!show){
            show = {
                Basic: true,
                Logic: false,
                Advanced: false,
                Functional: false,
                Business: false
            }
        } else {
            show = JSON.parse(show)
        }

        let tab = localStorage.getItem('block_tab')
        if(!tab) tab = 'blocks'

        this.state = {
            tab: tab,
            show: show,
            sections: []
        }

        this.toggleBlockSection = this.toggleBlockSection.bind(this)
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            }, ()=>localStorage.setItem('block_tab', tab))
        }
    }

    componentDidMount() {
        let sections = cloneDeep(SECTIONS);

        // premium blocks
        if(window.user_detail.admin > 0){
            sections.push({
                title: 'Business',
                items: [
                    { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"/>, tip: 'Ask users for access to their info (Name, Email, Phone)'  },
                    { text: 'Mail', type: 'mail', icon: <i className="far fa-envelope"/>, tip: 'Send Emails via SendGrid' }
                ]
            })
        }
        
        this.setState({
            sections: sections
        })
    }

    toggleBlockSection(section_title){
        let s = this.state
        s.show[section_title] = !s.show[section_title]
        localStorage.setItem('show', JSON.stringify(s.show))
        this.setState(s)
        this.forceUpdate()
    }

    render() {
        let block_content;

        if(this.state.tab === 'blocks'){
            block_content =
                this.state.sections.map((section, i) => {
                    return <div key={i} className="section no-select">
                        <span 
                            className="section-title" 
                            onClick={() => {this.toggleBlockSection(section.title)}}>
                                {this.state.show[section.title]? 
                                    <i className="fas fa-caret-down"></i>: 
                                    <i className="fas fa-caret-right"></i>
                                }
                                {section.title}
                        </span>
                        <Collapse isOpen={this.state.show[section.title]}>
                            <div className="mb-2 section-blocks">
                                {section.items.map((item, i) => {
                                    return <MenuItem item={item} key={i} data-tip={item.tip}/>
                                })}
                            </div>
                        </Collapse>
                    </div>
            })
        } else {
            if(this.props.user_modules.length > 0){
                block_content = 
                <div>
                {this.props.user_modules.map((user_module, i) => {
                    return <ModuleItem module={user_module} key={i} />;
                })}
                </div>
            }else{ 
                block_content = <div className="mt-2 text-center text-muted"><img className="image-editor mt-4 mb-3" src="/empty.png" alt="empty"/>You have no flows, visit the marketplace to get some! <Button color="primary mt-3" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button></div> 
            }
        }

        return <React.Fragment>
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
            {block_content}
        </React.Fragment>
    }
}

export default Blocks;
