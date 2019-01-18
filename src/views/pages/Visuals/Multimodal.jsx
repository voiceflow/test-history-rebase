import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import MUIButton from '@material-ui/core/Button';
import VoiceCards from 'views/components/Cards/VoiceCards'
import EmptyCard from 'views/components/Cards/EmptyCard'
import Masonry from 'react-masonry-component';

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
        if(this.state.loading){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Products</h5>
                    <span className="loader"/>
                </div>
            </div>
        }
        return(
            <div className="h-100 w-100">
                <React.Fragment>
                    {this.state.displays.length === 0 ?
                        <div className="super-center w-100 h-100">
                        <div className="empty-container">
                            <img src='/images/OpenSafe.svg' alt="open safe"/>
                            <p className="empty">No Visual Templates Exist</p>
                            <p className="empty-desc">Create Visuals with Alexa Presentation Language</p>
                            <Link to={`/visuals/${this.props.skill.skill_id}/display/new`} className="no-underline">
                                <MUIButton varient="contained" className="purple-btn">New Display</MUIButton>
                            </Link>
                        </div>
                        </div>
                        :
                        <div className="px-4 mx-3 mb-5 pt-3">
                        <div className="products-container position-relative">
                        <div className="space-between w-100 px-3">
                            <h3 className="text-muted">Visuals</h3>
                            <Link to={`/visuals/${this.props.skill.skill_id}/display/new`} className="no-underline btn purple-btn">
                                New Display
                            </Link>
                        </div>
                        <Masonry elementType='div' imagesLoadedOptions={{columnWidth: '200', itemSelector: ".grid-item"}}>
                            {this.state.displays.map(display => {
                                let name = display.title.match(/\b(\w)/g)
                                if(name) { name = name.join('') }
                                else { name = display.title }
                                name = name.substring(0,3)

                                return(
                                    <VoiceCards
                                        key={display.id}
                                        id={display.id}
                                        name={display.title}
                                        placeholder={<div className='no-image card-image'><h1>{name}</h1></div>}
                                        onDelete={this.deleteProduct}
                                        deleteLabel="Delete Visual"
                                        onClick={()=>this.props.history.push(`/visuals/${this.props.skill.skill_id}/display/${display.id}`)}
                                        buttonLabel="Edit Visual"
                                    />
                            )})}
                            <EmptyCard onClick={() => this.props.history.push(`/visuals/${this.props.skill_id}/display/new`)}/>
                        </Masonry>
                        </div>
                        </div>
                    }
                </React.Fragment>
            </div>)
    }
}

export default Multimodal;
