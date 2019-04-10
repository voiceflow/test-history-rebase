import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { pushVariable, setVariables } from './../../../../actions/variableActions'
import { updateVersion } from './../../../../actions/versionActions'
import { setError } from 'actions/modalActions'
import { Input, FormGroup, Label } from 'reactstrap';
import {Tooltip} from 'react-tippy'
import isVarName from 'is-var-name'

const defaultVariables = {
    'sessions': 'The Number of times a particular user has opened the app',
    'user_id': 'The user\'s Amazon/Google unique id',
    'timestamp': 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
    'platform': 'The platform your skill is running on ("alexa" or "google")',
    'locale': 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)'
}

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

        this.addGlobalVariable = this.addGlobalVariable.bind(this);
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

    addGlobalVariable (e){
        if(e) e.preventDefault();
        let variables = this.props.global_variables;
        let new_var = this.state.new_global;
        if(isVarName(new_var) && !variables.includes(new_var)){
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

    deleteGlobalVariable(variable){
        let variables = this.props.global_variables
        let index = variables.indexOf(variable)
        if (index !== -1) variables.splice(index, 1)
        this.props.updateSkill('globals', variables)
        this.forceUpdate()
    }

    render() {
        return <React.Fragment>
            {/*<span className="text-muted">Global variables can be accessed anywhere in the project</span>*/}
            <form id="variable-submit" onSubmit={this.addGlobalVariable}>
                <FormGroup className="mb-0 text-center">
                    <Label className='mt-2 text-left'>Create Variable</Label>
                        <Input autoFocus className="variable-box__control" readOnly={this.props.locked} name="new_global" value={this.state.new_global} onChange={this.handleChange} maxLength="16" placeholder="Variable Name"/>
                </FormGroup>
            </form>
            <small className="text-muted mb-4 pt-2 d-block">Press <b>'Enter'</b> to add variable</small>
            <div>
                <hr/>
                <Label>My Variables</Label>
                <div className="variables">
                    {this.props.variables.concat(this.props.global_variables).map((variable, i) => {
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
    }
}

const mapStateToProps = state => ({
    variables: state.variables.localVariables,
    global_variables: state.skills.skill.global
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
