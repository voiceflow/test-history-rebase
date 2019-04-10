import React, { Component } from 'react';
import {Button, Alert} from 'reactstrap';
import { connect } from 'react-redux'
import Select from 'react-select';
import {Link} from 'react-router-dom';
import _ from 'lodash';

class CancelPaymentBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.handleAddMap = this.handleAddMap.bind(this);
        this.handleRemoveMap = this.handleRemoveMap.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }

    handleAddMap(io) {
        var node = this.state.node;
        node.extras[io].push({
            arg1: null,
            arg2: null
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemoveMap(io, i) {
        let node = this.state.node;

        node.extras[io].splice(i, 1);

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleSelection(io, i, arg, value) {
        let node = this.state.node;

        if(node.extras[io][i][arg] !== value){
            node.extras[io][i][arg] = value;

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    render() {

        if(!Array.isArray(this.props.products) || this.props.products.length === 0){
            return <div className="text-center">
                <img className="mb-3 mt-5" src={'/images/OpenSafe.svg'} alt="user" width="80"/><br/>
                <span className="text-muted">You currently have no In Skill Products</span>
                <Link className="btn btn-secondary mt-3" to={`/business/${this.props.skill_id}/products`}>Add Products</Link> 
            </div>
        }

        let options = _.map(this.props.products, product => {
            return {
                value: product.id,
                label: product.name
            }
        })

        let current
        if(this.state.node.extras.product_id){
            current = _.find(this.props.products, p => {
            return p.id === this.state.node.extras.product_id;
            })
        }

        if(current){
            return <React.Fragment>
                <label className="space-between mb-3">
                    <span>{current.name}</span>
                    <span>($<span className="text-danger">{current.data.publishingInformation && 
                        current.data.publishingInformation.pricing && 
                        current.data.publishingInformation.pricing['amazon.com'] && 
                        current.data.publishingInformation.pricing['amazon.com'].defaultPriceListing && 
                        current.data.publishingInformation.pricing['amazon.com'].defaultPriceListing.price}</span>)</span>
                </label>
                <Button className="btn-primary btn-block btn-lg" onClick={() => this.props.history.push(`/business/${this.props.skill_id}/product/${current.id}`)}>
                    Edit Product <i className="fas fa-sign-in"/>
                </Button>
                <Button color="clear" block className="btn-lg mt-2" onClick={this.reset}>
                    Unlink Product
                </Button>
                <Alert color='warning' className="mt-3">
                    {current.data.type === 'SUBSCRIPTION' ? 'The user will have their subscription cancelled' : 'The user will be refunded their product purchase'}
                </Alert>
            </React.Fragment>
        }else{
            return <React.Fragment>
                <label>Select Existing Product</label>
                <Select
                    classNamePrefix="select-box"
                    onChange={selected => {
                        let node = this.state.node;
                        node.extras.product_id = selected.value
                        this.setState({
                            node: node,
                            selectedProduct: selected
                        })
                    }}
                    options={options}
                />
            </React.Fragment>
        }
    }
}

const mapStateToProps = state => ({
    skill_id: state.skills.skill.skill_id,
    products: state.products.products
})
export default connect(mapStateToProps)(CancelPaymentBlock);
