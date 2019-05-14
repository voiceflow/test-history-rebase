import React, { Component } from 'react'
import axios from 'axios/index';
import Masonry from 'react-masonry-component';
import { Card } from 'reactstrap';

import Button from 'components/Button'

class ModuleAdminPage extends Component {
    constructor(props){
        super(props)

        this.state = {
            modules: []
        }

        this.getModulesPendingCert = this.getModulesPendingCert.bind(this)
        this.approveModule = this.approveModule.bind(this)
    }

    getModulesPendingCert(){
        axios.get('/marketplace/cert/pending')
        .then(res => {
            this.setState({
                modules: res.data
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    approveModule(project_id, title, i){
        axios.put(`/marketplace/cert/${project_id}`)
        .then(res => {
            let curr_modules = this.state.modules
            curr_modules.splice(i, 1)
            this.setState({
                approved: {
                    title: title,
                    succeeded: true
                },
                modules: curr_modules
            })
        })
        .catch(err => {
            this.setState({
                approved: {
                    title: title,
                    succeeded: false
                }
            })
        })
    }

    componentDidMount(){
        this.getModulesPendingCert()
    }

    render() {

        let content = null
        if(this.state.approved){
            if(this.state.approved.succeeded){
                content = <div className="alert alert-success mb-4" role="alert">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Approved {this.state.approved.title}</h5>
                    </div>
                </div>
            } else {
                content = <div className="alert alert-danger mb-4" role="alert">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Failed to approve {this.state.approved.title}</h5>
                    </div>
                </div>
            }
        }
        return(
            <div className='Window'>
                {content}
                <Masonry elementType='div'>
                    {this.state.modules.map((module, i) =>
                        <Card key={i}>
                            {/* <img src={module.module_icon} style={styles} alt="module icon"></img> */}
                            <a href={"https://creator.getvoiceflow.com/preview/" + module.skill_id + "/" + module.diagram} className="mb-4 mt-4">{module.title}</a>
                            <Button onClick={() => {this.approveModule(module.project_id, module.title, i)}}>Approve</Button>
                        </Card>
                    )}
                </Masonry>
            </div>
        )
    }
}

export default ModuleAdminPage
