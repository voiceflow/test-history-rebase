import React, { PureComponent } from 'react';
import MenuItem from './MenuItem';
import TemplateItem from './TemplateItem';
import ModuleItem from './ModuleItem';
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label, ButtonGroup, Collapse } from 'reactstrap';
import isVarName from 'is-var-name';
import FlowButton from './FlowButton';
import {Tooltip} from 'react-tippy';
import cloneDeep from 'lodash/cloneDeep';

const sections = [{
    title: 'Basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-megaphone"/>, tip: 'Tell Alexa to play sounds or talk to the user' },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/>, tip: 'Listen for the user to make a choice from a list of options you set'  },
        { text: 'Command', type: 'command', icon: '⌘', tip: 'Add shortcuts for your users to navigate your skill quickly'},
        { text: 'Comment', type: 'comment', icon: <i className="fas fa-sticky-note"/>, tip: 'Add notes to your diagram'}
    ]
},{
    title: 'Advanced',
    items: [
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-music"/>, tip: 'Stream long audio files & URLs for the user' },
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>, tip: 'Choose randomly from a set number of paths' },
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/>, tip: 'Set the value of a variable, or many variables at once'  },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>, tip: 'Set conditions that activate paths only when true' },
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/>, tip: 'Capture what the user says into a variable'  },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/>, tip: 'Organize your project into manageable sections or perform computations'},
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/>, tip: 'Use external APIs and store responses into variables' },
        { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"/>, tip: 'Ask users for access to their info (Name, Email, Phone)'  },
   ]
},{
    title: 'Functional',
    items: [
        { text: 'Combine', type: 'combine', icon: <i className="fas fa-compress-alt"/>, tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit' },
    ]
}];

class Blocks extends PureComponent {
    constructor(props) {
        super(props);

        // Store state of basic + advanced tabs
        let show = localStorage.getItem('show')
        if(!show){
            show = {
                Basic: true,
                Advanced: false,
                Functional: false
            }
        } else {
            show = JSON.parse(show)
        }

        this.state = {
            open: true,
            new_var: '',
            new_global: '',
            tree: null,
            tab: 'blocks',
            show: show
        }

        this.openTab = this.openTab.bind(this);d
        this.handleChange = this.handleChange.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.updateTree = this.updateTree.bind(this);
        this.toggleBlockSection = this.toggleBlockSection.bind(this);
        this.visited = new Set();
        this.sections = [];
    }

    componentDidMount() {
        this.props.build(this.updateTree);
        this.sections = cloneDeep(sections);

        // premium blocks
        if(window.user_detail.admin > 0){
            this.sections[1].items.push({ text: 'Mail', type: 'mail', icon: <i className="far fa-envelope"/>, tip: 'Send Emails via SendGrid' })
        }
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

        if(this.state.block_tab_state === 'blocks'){
            block_content =
                this.sections.map((section, i) => {
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
                            {section.items.map((item, i) => {
                                return <MenuItem item={item} key={i} data-tip={item.tip}/>
                            })}
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
                <Button outline={this.state.block_tab_state !== 'blocks'} onClick={() => {this.setState({block_tab_state: 'blocks'})}} disabled={this.state.block_tab_state === 'blocks'}> Blocks </Button>
                <Button outline={this.state.block_tab_state !== 'modules'} onClick={() => {this.setState({block_tab_state: 'modules'})}} disabled={this.state.block_tab_state === 'modules'}>Flows</Button>
            </ButtonGroup>*/}
            {block_content}
        </React.Fragment>
    }
}

export default Menu;
