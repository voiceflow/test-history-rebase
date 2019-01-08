import React, { PureComponent } from 'react';
import MenuItem from './components/MenuItem';
import ModuleItem from './components/ModuleItem';
import { Button, Collapse } from 'reactstrap';
// import { Button, Collapse, ButtonGroup } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';

const SECTIONS = [{
    title: 'basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-comment"/>, tip: 'Tell Alexa to play sounds or talk to the user' },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/>, tip: 'Listen for the user to make a choice from a list of options you set'  },
    ]
},{
    title: 'logic',
    items: [
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/>, tip: 'Set the value of a variable, or many variables at once' },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>, tip: 'Set conditions that activate paths only when true' },
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/>, tip: 'Capture what the user says into a variable' },
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>, tip: 'Choose randomly from a set number of paths' },
   ]
},{
    title: 'advanced',
    items: [
        { text: 'Jump', type: 'jump', icon: <i className="fas fa-step-forward"/>, tip: 'Add commands for your users to navigate around quickly'},
        { text: 'Command', type: 'command', icon: <i className="fas fa-exclamation"/>, tip: 'Give users info about their current state'},
        { text: 'Intent', type: 'intent', icon: <i className="fas fa-user-alt"/>, tip: 'Intent blocks select choices and capture slot values from user input' },
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-play"/>, tip: 'Stream long audio files & URLs for the user' },
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/>, tip: 'Use external APIs and store responses into variables' },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/>, tip: 'Organize your project into manageable sections or perform computations'},
   ]
},{
    title: 'functional',
    items: [
        { text: 'Exit', type: 'exit', icon: <i className="fas fa-sign-out"/>, tip: 'End the skill on the current flow' },
        { text: 'Combine', type: 'combine', icon: <i className="fas fa-compress-alt"/>, tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit' },
        { text: 'Comment', type: 'comment', icon: <i className="fas fa-comment"/>, tip: 'Add notes to your diagram'},
    ]
},{
    title: 'visuals',
    items: [
        { text: 'Card', type: 'card', icon: <i className="fas fa-sticky-note"/>, tip: 'Tell Alexa to show a card'  },
        { text: 'Display', type: 'display', icon: <i className="far fa-image"/>, tip: 'Show a Multimodal Display on the screen using APL' }
    ]
}]

// const TABS = ['blocks', 'modules']

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
                title: 'business',
                items: [
                    { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"></i>, tip: 'Ask users for access to their info (Name, Email, Phone)'  },
                    { text: 'Mail', type: 'mail', icon: <i className="fas fa-envelope"></i>, tip: 'Send Emails via SendGrid' },
                    // { text: 'Payment', type: 'payment', icon: <i className="fas fa-money-bill-wave-alt"></i>, tip: 'Request payment from user'  },
                    // { text: 'Unsubscribe', type: 'cancel_payment', icon: <i className="fas fa-undo-alt"></i>, tip: 'Cancel payment or subscription'  }
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
                        <div 
                            className="section-title" 
                            onClick={() => {this.toggleBlockSection(section.title)}}>
                                <span>
                                <i className={"fas fa-caret-down mr-1 rotate" + (this.state.show[section.title] ? "" : " fa-rotate--90")}/>
                                {section.title}
                                </span>
                                <span className={"title-dot " + section.title}/>
                        </div>
                        <Collapse isOpen={this.state.show[section.title]}>
                            <div className="mb-3 section-blocks">
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
            {/*<ButtonGroup className="toggle-group mb-2">
                {TABS.map(tab => {
                    return <Button
                        key={tab}
                        onClick={() => this.switchTab(tab)} 
                        outline={this.state.tab !== tab}
                        disabled={this.state.tab === tab}> 
                        {tab}
                    </Button>
                })}
            </ButtonGroup>*/}
            {block_content}
        </React.Fragment>
    }
}

export default Blocks;
