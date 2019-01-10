import React, { Component } from 'react';
import {Button} from 'reactstrap';
import Select from 'react-select';

class CancelPaymentBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            products: []
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
        let options;
        let current;
        if(!this.state.node.extras.product_id){
            options = this.props.products
            .map(product => {
                return {
                    value: product.id,
                    label: product.name
                }
            });
        } else {
            current = this.props.products
            .find(p => {
                return p.id === this.state.node.extras.product_id;
            });
        }

        return (
            <div>
                {!(this.state.node.extras.product_id && current) ?
                    <React.Fragment>
                        <React.Fragment>
                            <label>Select Existing Product</label>
                            <Select
                                classNamePrefix="select-box"
                                onChange={selected => {
                                    let node = this.state.node;
                                    node.extras.product_id = selected.value;
                                    this.setState({
                                        node: node
                                    })
                                }}
                                options={options}
                            />
                            <hr className="mb-1"/>
                            </React.Fragment>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <label>{current.name}</label>
                        <Button className="btn-primary btn-block btn-lg" onClick={() => this.props.editProduct(current)}>
                            Edit Product <i className="fas fa-sign-in"/>
                        </Button>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default CancelPaymentBlock;
