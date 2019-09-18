import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Dropdown from '@/componentsV2/Dropdown';
import { getSelectedLocales } from '@/ducks/utils';

import MenuItem from '../Sidebars/components/MenuItem';

const cancel = {
  text: 'Cancel Payment',
  type: 'cancel',
  icon: <i className="fas fa-user-minus" />,
  tip: "Refund a purchase or cancel an user's subscription",
};
export class Payment extends Component {
  state = {
    node: this.props.node,
    selectedProduct: null,
  };

  reset = () => {
    const { node } = this.state;

    node.extras.product_id = null;
    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  };

  openProductPage = () => {
    this.props.history.push(`/tools/${this.props.skill_id}/products`);
  };

  render() {
    const { products, locales } = this.props;
    const { selectedProduct } = this.state;

    if (getSelectedLocales(locales).length === 0) {
      return <Alert color="danger">In Skill Purchases are not supported for any of the selected regions of this project</Alert>;
    }

    if (!Array.isArray(products) || products.length === 0) {
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

    const options = products.map((product) => {
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
          </label>
          <Button isPrimary isBlock isLarge onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/product/${current.id}`)}>
            Edit Product <i className="fas fa-sign-in" />
          </Button>
          <Button isClear isLarge isBlock className="mt-2" onClick={this.reset}>
            Unlink Product
          </Button>
          {current.type === 'SUBSCRIPTION' ? (
            <>
              <h2 className="cut-through mt-5 mb-4">
                <span>Subscription Settings</span>
              </h2>
              <Alert>Alexa requires an unsubscribe option, place a cancel payment block in an easily accessible part of your flow</Alert>
            </>
          ) : (
            <>
              <h2 className="cut-through mt-5 mb-4">
                <span>Refund Settings</span>
              </h2>
              <Alert>Alexa requires users be able to refund a purchase, place a cancel payment block in an easily accessible part of your flow</Alert>
            </>
          )}
          <MenuItem item={cancel} data={current.id} />
        </>
      );
    }
    return (
      <>
        <div className="d__label-title">
          <label>Select Existing Product</label>
          <div className="d__see_all" onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/products`)}>
            See all
          </div>
        </div>
        <Dropdown
          options={options}
          placeholder="Select product"
          value={selectedProduct && selectedProduct.name}
          onSelect={(selected) => {
            const { node } = this.state;
            node.extras.product_id = selected;
            this.setState({
              node,
              selectedProduct: selected,
            });
          }}
        />
        <div>
          <div className="d__or_box">
            <div className="d__or_text">OR</div>
          </div>
        </div>
        <button className="btn-clear btn-block btn-lg" onClick={() => this.props.history.push(`/tools/${this.props.skill_id}/products`)}>
          Create new product
        </button>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  locales: state.skills.skill.locales,
  products: state.products.products,
});

export default connect(mapStateToProps)(Payment);
