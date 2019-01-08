import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import MUIButton from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Card, Alert } from 'reactstrap';

import './Display.css'

class Multimodal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displays: [],
            loading: true,
            error: null,
            confirm: null
        }
    }

    componentWillMount() {
        axios.get(`/multimodal/displays?skill_id=${this.props.skill.skill_id}`)
        .then(res => {
            if(Array.isArray(res.data)){
                this.setState({
                    displays: res.data,
                    loading: false
                })
            }else{
                throw new Error("False Type")
            }
        })
        .catch(err => {
            console.error(err)
            this.props.onError('Unable to Retrieve Displays')
            this.setState({
                loading: false
            })
        })
    }

    deleteDisplay(id) {
        this.props.onConfirm(null)
        axios.delete(`/multimodal/display/${id}`)
        .then(()=>{
            let displays = this.state.displays;
            let index = displays.findIndex(d => d.id === id);
            if (index > -1) {
              displays.splice(index, 1);
            }
            this.setState({
                displays: displays
            });
        })
        .catch(err=>{
            console.error(err)
            this.props.onError('Unable to delete display')
        });
    }

    render() {

        return (
            <div className="business-page-inner">
                { this.state.loading ? 
                    <div className="super-center h-100 w-100">Loading...</div> :
                    <div className="content">
                        <Link to={`/visuals/${this.props.skill.skill_id}/display/new`} className="no-underline">
                            <MUIButton varient="contained" className="purple-btn"><i className="far fa-plus mr-2"/> New Display</MUIButton>
                        </Link>
                        <hr/>
                        {this.state.displays.length === 0 ? 
                            <h5 className="text-muted">No Multimodal Displays</h5> :
                            <React.Fragment>
                                {this.state.displays.map(display => 
                                    <Card key={display.id} className="display-card">
                                        <CardActionArea className="display-card-action"
                                            onClick={()=>this.props.history.push(`/visuals/${this.props.skill.skill_id}/display/${display.id}`)}>
                                            <div>
                                                <h5>{display.title}</h5>
                                                <small className="text-muted"><b>ID:</b> {display.id}</small><br/>
                                                <small className="text-muted"><b>Description:</b> {display.description ? display.description : <span className="empty-badge">EMPTY</span>}</small>
                                            </div>
                                        </CardActionArea>
                                        <div className="display-card-delete" onClick={()=>{
                                            this.props.onConfirm({
                                                warning: true,
                                                text: <Alert color="danger" className="mb-0">Are you sure you want to delete this display? Any Skill using this display will fail to send multimodals</Alert>,
                                                confirm: ()=> this.deleteDisplay(display.id)
                                            })
                                        }}>
                                            Delete <br/>
                                            <i className="fas fa-trash"/>
                                        </div>
                                    </Card>
                                )}
                            </React.Fragment>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default Multimodal;
