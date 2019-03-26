import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { pushVariable, setVariables } from './../../../../actions/variableActions'
import { updateVersion } from './../../../../actions/versionActions'
import { setError } from 'ducks/modal'
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label, ButtonGroup } from 'reactstrap';
import {Tooltip} from 'react-tippy'
import isVarName from 'is-var-name'

const defaultVariables = {
    'sessions': 'The Number of times a particular user has opened the app',
    'user_id': 'The user\'s Amazon/Google unique id',
    'timestamp': 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
    'platform': 'The platform your skill is running on ("alexa" or "google")',
    'locale': 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)'
}

const TABS = ['global', 'local']

export class Variables extends PureComponent {
    constructor(props) {
        super(props);

        let tab = localStorage.getItem('variable_tab')
        if(!tab) tab = 'global'

        this.state = {
        	tab: tab,
        	new_var: '',
            new_global: ''
        }

        this.addVariable = this.addVariable.bind(this);
        this.addGlobalVariable = this.addGlobalVariable.bind(this);
        this.deleteVariable = this.deleteVariable.bind(this);
        this.deleteGlobalVariable = this.deleteGlobalVariable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            }, ()=>localStorage.setItem('variable_tab', tab))
        }
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addVariable (e){
        if(e) e.preventDefault();
        let variables = this.props.variables;
        let new_var = this.state.new_var;
        if(isVarName(new_var) && !variables.includes(new_var) && !this.props.global_variables.includes(new_var)){
            this.props.addVariable(new_var)
            this.setState({
                new_var: ""
            })
        }else{
            alert('Invalid Variable: Variables must start with a character and can not contain spaces or special characters');
        }
        return false
    }

    addGlobalVariable (e){
        if(e) e.preventDefault();
        let variables = this.props.global_variables;
        let new_var = this.state.new_global;
        if(isVarName(new_var) && !variables.includes(new_var) && !this.props.variables.includes(new_var)){
            variables.push(new_var);
            this.props.updateSkill('globals', variables)
            this.setState({
                new_global: ""
            })
        }else{
            this.props.setError('Invalid Variable: Variables can\'t have the same name and must start with a character and can not contain spaces or special characters');
        }
        return false
    }

    deleteVariable(variable){
        let variables = this.props.variables
        let index = variables.indexOf(variable)
        if (index !== -1) variables.splice(index, 1)
        this.props.setVariables(variables)
        this.forceUpdate()
    }

    deleteGlobalVariable(variable){
        let variables = this.props.global_variables
        let index = variables.indexOf(variable)
        if (index !== -1) variables.splice(index, 1)
        this.props.updateSkill('globals', variables)
        this.forceUpdate()
    }

    render() {
    	let variable_tab;
        if(this.state.tab === 'global'){
            variable_tab = <React.Fragment>
                {/*<span className="text-muted">Global variables can be accessed anywhere in the project</span>*/}
                <form id="variable-submit" onSubmit={this.addGlobalVariable}>
                    <FormGroup className="mb-0">
                        <Label className='section-title mt-3'>Add New Global Variable</Label>
                        <InputGroup>
                            <Input autoFocus className="form-control-border left" readOnly={this.props.locked} name="new_global" value={this.state.new_global} onChange={this.handleChange} maxLength="16" placeholder="Variable Name"/>
                            <InputGroupAddon addonType="append"><Button type="submit" disabled={this.props.locked} className="new_var"><i className="fas fa-plus"/></Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </form>
                <h1 className="down-arrow"><i className="far fa-long-arrow-alt-down"></i></h1>
                <div>
                    <Label className='section-title'>Global Variables</Label>
                    <div className="variables">
                        {this.props.global_variables.map((variable, i) => {
                            if(variable in defaultVariables){
                                return <Tooltip key={variable} position="bottom" html={<div style={{ width: 165 }}>{defaultVariables[variable]}</div>}>
                                    <div className="variable_tag global default">{'{' + variable + '}'}</div>
                                </Tooltip>
                            }else{
                                return <div key={variable} className="variable_tag global">{'{' + variable + '}'} <span onClick={() => this.deleteGlobalVariable(variable)}><i className="fas fa-times"></i></span></div>
                            }
                        })}
                    </div>
                </div>
            </React.Fragment>
        }else if(this.state.tab === 'local'){
            variable_tab = <React.Fragment>
                {/*<span className="text-muted">Local Variables are accessed only by the current flow</span>*/}
                <form id="variable-submit" onSubmit={this.addVariable}>
                    <FormGroup className="mb-0">
                        <Label className='section-title mt-3'>Add New Local Variable</Label>
                        <InputGroup>
                            <Input autoFocus className="form-control-border left"  readOnly={this.props.locked} name="new_var" value={this.state.new_var} onChange={this.handleChange} maxLength="16" placeholder="Variable Name"/>
                            <InputGroupAddon addonType="append"><Button type="submit" className="new_var" disabled={this.props.locked}><i className="fas fa-plus"/></Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </form>
                <h1 className="down-arrow"><i className="far fa-long-arrow-alt-down"></i></h1>
                <div>
                    <Label className='section-title'>Local Variables</Label>
                    <div className="variables">
                        {this.props.variables.length > 0 ? this.props.variables.map(function(variable, i){
                            return <div key={variable} className="variable_tag">
                                {'{' + variable + '}'} <span onClick={() => this.deleteVariable(variable)}><i className="fas fa-times"></i></span>
                            </div>
                        }.bind(this)) : <span className="text-muted">No Existing Variables</span>}
                    </div>
                </div>
            </React.Fragment>
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
            {variable_tab}
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    global_variables: state.skills.skill.global,
    variables: state.variables.localVariables
})

const mapDispatchToProps = dispatch => {
    return {
        addVariable: variable => dispatch(pushVariable(variable)),
        setVariables: variables => dispatch(setVariables(variables)),
        updateSkill: (type, val) => dispatch(updateVersion(type, val)),
        setError: err => dispatch(setError(err)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Variables);
