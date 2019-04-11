import React, {Component} from 'react'
import LightCanvas from '../../Canvas/LightCanvas'
import { connect } from 'react-redux'
import moment from 'moment'
import {Link} from 'react-router-dom'
import axios from 'axios'
// import _ from 'lodash'

import { Spinner } from 'views/components/Spinner'
import { setConfirm } from 'ducks/modal'
import {Modal, ModalFooter, FormGroup, Label, Alert, Table, Button} from 'reactstrap'

class BackupSettings extends Component{
    constructor(props){
        super(props)

        this.state = {
            preview: false,
            loading: true,
            curr_preview: {
                created: new Date(),
            },
            versions: [],
            live_version: null
        }

        this.confirmRestore = this.confirmRestore.bind(this)
        this.previewBackup = this.previewBackup.bind(this)
    }

    componentDidMount(){
        axios.get(`/project/${this.props.skill.project_id}/live_version`)
        .then(res => {
            let live_version = res.data.live_version
            axios.get(`/project/${this.props.skill.project_id}/versions`)
            .then(res => {
                let versions = []
                for(let i=0;i<res.data.length;i++){
                    if(res.data[i].skill_id !== live_version){
                        versions.push(res.data[i])
                    } else {
                        live_version = res.data[i]
                    }
                }

                this.setState({
                    loading: false,
                    versions: versions,
                    live_version: live_version
                })
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: 'Unable to load versions'
                })
            })
        })
        .catch(err => {
            this.setState({
                loading: false,
                error: 'Unable to load versions'
            })
        })
    }

    previewBackup(version){
        this.setState({
            preview: true,
            curr_preview: version,
        })
    }

    confirmRestore(skill_id, canonical_skill_id, skill) {
        this.props.setConfirm({
            warning: true,
            text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint. </Alert>,
            confirm: this.props.onSwapVersions,
            params: [skill_id]
        })
    }

    render(){
        if(this.state.loading){
            return React.createElement(Spinner, {name: 'Backups'})
        }

        if((!Array.isArray(this.state.versions) || this.state.versions.length === 0) && !this.state.live_version){
            return <div className="settings-content clearfix"><Alert color="warning" className="mb-0">There are currently no backups for this skill<br/>Backups are generated every time when you upload your skill</Alert></div>
        }

        return <React.Fragment>
            {/* Modal for previewing backups */}
            <Modal isOpen={this.state.preview} size="xl" toggle={()=>this.setState({preview: false})} className="light-canvas-modal">
                <div id="light-canvas-wrap">
                    <div className="no-select" id="PreviewBar">
                        <h3 className="font-weight-light">{moment(this.state.curr_preview.created).fromNow()}</h3>
                    </div>
                    <LightCanvas diagram_id={this.state.curr_preview.diagram}/>
                </div>
                <button className="goback-btn position-absolute" onClick={()=>this.setState({preview: false})} style={{top: 320, left: -90}}/>
                
                <ModalFooter>
                    <button className="btn-primary ml-auto mr-auto" onClick={() => this.confirmRestore(this.state.curr_preview.skill_id, this.state.curr_preview.canonical_skill_id, this.state.curr_preview)}>Restore</button>
                </ModalFooter>
            </Modal>

            <React.Fragment>
                <div className="settings-content clearfix">
                    <FormGroup>
                        
                        <Label>
                            Backups
                        </Label>
                        <div className="helper-text mb-2">Restore your skill to previous versions. A version is saved every time you upload your skill to Alexa{this.props.user.admin > 0 ? "" : ". Upgrade to access this premium feature"}</div>
                        <div id="backup">
                            {this.props.user.admin === 0 &&
                            <div id="backup-overlay" className="d-flex justify-content-center">
                                <div id="backup-upgrade-btn" className="text-center">
                                    <Link className="btn-primary" to='/account/upgrade'>
                                        Upgrade
                                    </Link>
                                </div>
                            </div>}
                            <Table>
                                <thead>
                                    <tr>
                                        <th><label className="text-left">Saved</label></th>
                                        <th><label className="text-left">Platform</label></th>
                                        <th><label className="text-left ml-4">Preview</label></th>
                                        <th><label className="text-left">Restore</label></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.live_version ? 
                                        <tr className="table-primary">
                                            <td>{moment(this.state.live_version.created).fromNow()} <br/> (Current live version) </td>
                                            <td>
                                                <Button className='btn-primary' onClick={() => this.previewBackup(this.state.live_version)}>Preview</Button>
                                            </td>
                                            <td>
                                                <Button className='btn-primary' onClick={() => this.confirmRestore(this.state.live_version.skill_id, this.state.live_version.canonical_skill_id, this.state.live_version)}>Restore</Button>
                                            </td>
                                        </tr>
                                        :
                                        null
                                    }
                                    {this.state.versions.map((version, i) => {
                                        return <tr key={i}>
                                            <td >{moment(version.created).fromNow()}</td>
                                            <td className="text-center">{version.published_platform === 'google' ? <i className="fab fa-google"/> :  <i className="fab fa-amazon"/>}</td>
                                            <td>
                                                <button className='btn-tertiary' onClick={() => this.previewBackup(version)}>Preview</button>
                                            </td>
                                            <td>
                                                <button className='btn-primary-small' onClick={() => this.confirmRestore(version.skill_id, version.canonical_skill_id, version)}>Restore</button>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </FormGroup>
                </div>
            </React.Fragment>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
  user: state.account
})

const mapDispatchToProps = dispatch => {
    return {
        setConfirm: (confirm) => dispatch(setConfirm(confirm))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BackupSettings)