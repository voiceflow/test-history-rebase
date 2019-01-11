import _ from 'lodash';
import React, { Component } from 'react';
import {Button} from 'reactstrap';
import Select from 'react-select';

class PaymentBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            products: [],
            selectedProduct: null,
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
        if (this.props.products) {
            options = _.map(this.props.products, product => {
              return {
                  value: product.id,
                  label: product.name
              }
            });
            if(this.state.node.extras.product_id){
              current = _.find(this.props.products, p => {
                return p.id === this.state.node.extras.product_id;
              });
            }
        }
        return (
            <div>
              {this.props.products && this.props.products.length > 0 ?
                  <React.Fragment>
                      <label>Select Existing Product</label>
                      <Select
                          classNamePrefix="select-box"
                          onChange={selected => {
                              let node = this.state.node;
                              node.extras.product_id = selected.value;
                              this.setState({
                                  node: node,
                                  selectedProduct: selected
                              })
                          }}
                          options={options}
                          defaultValue={options ? options[0] : null}
                      />
                      </React.Fragment>
              : null}
                {!current ?
                    <React.Fragment>
                        <h2 className="cut-through"><span>or</span></h2>
                        <Button className="purple-btn btn-block btn-lg" onClick={() => this.props.history.push(`/products/${this.props.skill_id}/`)}>
                            Create New Product <i className="fas fa-sign-in"/>
                        </Button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <label>{current.name}</label>
                        <Button className="btn-primary btn-block btn-lg" onClick={() => this.props.history.push(`/products/${this.props.skill_id}/template/${current.id}`)}>
                            Edit Product <i className="fas fa-sign-in"/>
                        </Button>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default PaymentBlock;
