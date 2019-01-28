import React, {Component} from 'react'
import LightCanvas from '../../Canvas/LightCanvas'
import moment from 'moment'
import {Link} from 'react-router-dom'
import axios from 'axios'
// import _ from 'lodash'

import {Modal, FormGroup, Label, Alert, Table, Button} from 'reactstrap'

class BackupSettings extends Component{
    constructor(props){
        super(props)

        this.state = {
            preview: false,
            loading: true,
            curr_preview: {
                created: new Date(),
            },
            versions: []
        }

        this.confirmRestore = this.confirmRestore.bind(this)
        this.previewBackup = this.previewBackup.bind(this)
    }

    componentDidMount(){
        axios.get(`/skill/${this.props.skill.skill_id}/versions`)
        .then(res => {
            this.setState({
                loading: false,
                versions: res.data
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
        this.props.onConfirm({
            warning: true,
            text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint. </Alert>,
            confirm: this.props.onSwapVersions,
            params: [skill_id, canonical_skill_id, skill]
        })
    }

    render(){
        if(this.state.loading){
            return <div className="text-center mt-5">
                <span className="loader text-lg"/>
                <h5 className="text-muted mt-2">Loading Backups</h5>
            </div>
        }

        if(!Array.isArray(this.state.versions) || this.state.versions.length === 0){
            return <div className="settings-content clearfix"><Alert color="warning">There are currently no backups for this skill<br/>Backups are generated every time when you upload your skill to Alexa</Alert></div>
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
            </Modal>

            <React.Fragment>
                <div className="settings-content clearfix">
                    <FormGroup>
                        <Label>Backups</Label>
                        <Alert>Restore your skill to previous versions<br/>Saved every time when you upload your skill to Alexa</Alert>
                        <div id="backup">
                            {window.user_detail.admin === 0 &&
                            <div id="backup-overlay" className="d-flex justify-content-center">
                                <div className="text-center">
                                    <Link to="/account" className="btn btn-success btn-thicc">Upgrade Plan To Restore</Link>
                                </div>
                            </div>}
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Saved</th>
                                        <th>Preview</th>
                                        <th>Restore</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.versions.map((version, i) => {
                                        return <tr key={i}>
                                            <td>{moment(version.created).fromNow()}</td>
                                            <td>
                                                <Button className='purple-btn' onClick={() => this.previewBackup(version)}>Preview</Button>
                                            </td>
                                            <td>
                                                <Button className='purple-btn' onClick={() => this.confirmRestore(version.skill_id, version.canonical_skill_id, version)}>Restore</Button>
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

export default BackupSettings