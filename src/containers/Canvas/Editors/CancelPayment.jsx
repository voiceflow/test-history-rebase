import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Alert, Button } from 'reactstrap';

export class CancelPayment extends Component {
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

  onUpdate() {
    this.setState(
      {
        node: this.state.node,
      },
      this.props.onUpdate
    );
  }

  handleAddMap(io) {
    const node = this.state.node;
    node.extras[io].push({
      arg1: null,
      arg2: null,
    });

    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  }

  handleRemoveMap(io, i) {
    const node = this.state.node;

    node.extras[io].splice(i, 1);

    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  }

  handleSelection(io, i, arg, value) {
    const node = this.state.node;

    if (node.extras[io][i][arg] !== value) {
      node.extras[io][i][arg] = value;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  render() {
    if (!Array.isArray(this.props.products) || this.props.products.length === 0) {
      return (
        <div className="text-center">
          <img className="mb-3 mt-5" src="/images/OpenSafe.svg" alt="user" width="80" />
          <br />
          <span className="text-muted">You currently have no In Skill Products</span>
          <Link className="btn btn-secondary mt-3" to={`/tools/${this.props.skill_id}/products`}>
            Add Products
          </Link>
        </div>
      );
    }

    const options = _.map(this.props.products, (product) => {
      return {
        value: product.id,
        label: product.name,
      };
    });

    let current;
    if (this.state.node.extras.product_id) {
      current = _.find(this.props.products, ['id', this.state.node.extras.product_id]);
    }

    if (current) {
      return (
        <>
          <label className="space-between mb-3">
            <span>{current.name}</span>
            <span>
              ($
              <span className="text-danger">
                {_.get(current, ['data', 'publishingInformation', 'pricing', 'amazon.com', 'defaultPriceListing', 'price'])}
              </span>
              )
            </span>
          </label>
          <Button
            className="btn-primary btn-block btn-lg"
            onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/product/${current.id}`)}
          >
            Edit Product <i className="fas fa-sign-in" />
          </Button>
          <Button color="clear" block className="btn-lg mt-2" onClick={this.reset}>
            Unlink Product
          </Button>
          <Alert color="warning" className="mt-3">
            {current.data.type === 'SUBSCRIPTION'
              ? 'The user will have their subscription cancelled'
              : 'The user will be refunded their product purchase'}
          </Alert>
        </>
      );
    }
    return (
      <>
        <label>Select Existing Product</label>
        <Select
          classNamePrefix="select-box"
          onChange={(selected) => {
            const node = this.state.node;
            node.extras.product_id = selected.value;
            this.setState({
              node,
              selectedProduct: selected,
            });
          }}
          options={options}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  products: state.products.products,
});
export default connect(mapStateToProps)(CancelPayment);
