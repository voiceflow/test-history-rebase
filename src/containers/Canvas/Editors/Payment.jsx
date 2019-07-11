import Button from 'components/Button';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Alert } from 'reactstrap';

import { selectStyles } from '../../../components/VariableSelect/VariableSelect';
import MenuItem from '../Sidebars/components/MenuItem';

const cancel = {
  text: 'Cancel Payment',
  type: 'cancel',
  icon: <i className="fas fa-user-minus" />,
  tip: "Refund a purchase or cancel an user's subscription",
};
export class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: this.props.node,
      selectedProduct: null,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.handleAddMap = this.handleAddMap.bind(this);
    this.handleRemoveMap = this.handleRemoveMap.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.reset = this.reset.bind(this);
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

  reset() {
    const node = this.state.node;
    node.extras.product_id = null;
    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  }

  openProductPage = () => {
    this.props.history.push(`/tools/${this.props.skill_id}/products`);
  };

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

    const productOptions = _.cloneDeep(this.props.products);

    const options = productOptions.map((product, idx) => {
      if (idx === productOptions.length - 1) {
        return {
          value: product.id,
          label: product.name,
          openProductPage: this.openProductPage,
        };
      }
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
        <React.Fragment>
          <label className="space-between mb-3">
            <span>{current.name}</span>
            <span>
              $
              <span className="text-cash-money">
                {_.get(current, ['data', 'publishingInformation', 'pricing', 'amazon.com', 'defaultPriceListing', 'price'])}
              </span>
            </span>
          </label>
          <Button isPrimary isBlock isLarge onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/product/${current.id}`)}>
            Edit Product <i className="fas fa-sign-in" />
          </Button>
          <Button isClear isLarge isBlock className="mt-2" onClick={this.reset}>
            Unlink Product
          </Button>
          {current.data.type === 'SUBSCRIPTION' ? (
            <React.Fragment>
              <h2 className="cut-through mt-5 mb-4">
                <span>Subscription Settings</span>
              </h2>
              <Alert>Alexa requires an unsubscribe option, place a cancel payment block in an easily accessible part of your flow</Alert>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h2 className="cut-through mt-5 mb-4">
                <span>Refund Settings</span>
              </h2>
              <Alert>Alexa requires users be able to refund a purchase, place a cancel payment block in an easily accessible part of your flow</Alert>
            </React.Fragment>
          )}
          <MenuItem item={cancel} data={current.id} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="d__label-title">
          <label>Select Existing Product</label>
          <div className="d__see_all" onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/products`)}>
            See all
          </div>
        </div>
        <Select
          classNamePrefix="select-box"
          styles={selectStyles}
          onChange={(selected) => {
            if (selected.openProductPage) {
              return selected.openProductPage();
            }
            const node = this.state.node;
            node.extras.product_id = selected.value;
            this.setState({
              node,
              selectedProduct: selected,
            });
          }}
          options={options}
        />
        <div>
          <div className="d__or_box">
            <div className="d__or_text">OR</div>
          </div>
        </div>
        <button className="btn-clear btn-block btn-lg" onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/products`)}>
          Create new product
        </button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  products: state.products.products,
});
export default connect(mapStateToProps)(Payment);
