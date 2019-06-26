import Button from "components/Button";
import EmptyCard from "components/Cards/EmptyCard";
import VoiceCards from "components/Cards/VoiceCards";
import { Spinner } from "components/Spinner/Spinner";
import { copyProduct, deleteProduct } from "ducks/product";
import _ from "lodash";
import React, { Component } from "react";
import Masonry from "react-masonry-component";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.onProductClick = this.onProductClick.bind(this);
  }

  onProductClick(product_id) {
    this.props.history.push(
      `/tools/${this.props.skill_id}/product/${product_id}`
    );
  }

  render() {
    if (this.props.loading) {
      return React.createElement(Spinner, { name: "Products" });
    }
    return (
      <div className="h-100 w-100">
        <React.Fragment>
          {this.props.products.length === 0 ? (
            <div className="super-center w-100 h-100">
              <div className="empty-container">
                <img src="/images/OpenSafe.svg" alt="open safe" width="100px" />
                <p className="empty">No products exists</p>
                <p className="empty-desc">
                  Monetize your project with in skill purchases such as
                  consumables and subscriptions.
                </p>
                <Link
                  to={`/tools/${this.props.skill_id}/product/new`}
                  className="no-underline"
                >
                  <Button isPrimary varient="contained">
                    Create a product
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-4 mx-3 mb-5 pt-3">
              <div className="products-container position-relative">
                <div className="space-between w-100 px-3">
                  <h5 className="text-muted mb-0">Products</h5>
                  <div>
                    <Link
                      to={`/canvas/${this.props.skill_id}`}
                      className="no-underline btn btn-secondary mr-2"
                    >
                      Back
                    </Link>
                    <Link
                      to={`/tools/${this.props.skill_id}/product/new`}
                      className="no-underline btn btn-primary"
                    >
                      New Product
                    </Link>
                  </div>
                </div>
                <Masonry
                  elementType="div"
                  imagesLoadedOptions={{
                    columnWidth: "200",
                    itemSelector: ".grid-item"
                  }}
                >
                  {_.map(this.props.products, product => {
                    let icon;
                    const smallIcon =
                      product.data.publishingInformation.locales["en-US"]
                        .smallIconUri;
                    const largeIcon =
                      product.data.publishingInformation.locales["en-US"]
                        .largeIconUri;
                    if (!_.isNull(largeIcon)) {
                      icon = largeIcon;
                    } else if (!_.isNull(smallIcon)) {
                      icon = smallIcon;
                    }

                    let name = "";
                    if (!icon) {
                      name = product.name.match(/\b(\w)/g);
                      if (name) {
                        name = name.join("");
                      } else {
                        name = product.name;
                      }
                      name = name.substring(0, 3);
                    }
                    return (
                      <VoiceCards
                        key={product.id}
                        id={product.id}
                        icon={icon}
                        name={product.name}
                        placeholder={
                          <div className="no-image card-image">
                            <h1>{name}</h1>
                          </div>
                        }
                        onDelete={product_id =>
                          this.props.deleteProduct(
                            this.props.skill_id,
                            product_id
                          )
                        }
                        onCopy={product_id =>
                          this.props.copyProduct(
                            this.props.skill_id,
                            product_id
                          )
                        }
                        deleteLabel="Delete Product"
                        copyLabel="Copy Product"
                        onClick={this.onProductClick}
                        buttonLabel="Edit Product"
                        desc={
                          product.data.type === "ENTITLEMENT"
                            ? "One-Time"
                            : product.data.type
                        }
                        secondaryDesc={`$${product.data.publishingInformation.pricing["amazon.com"].defaultPriceListing.price}`}
                      />
                    );
                  })}
                  <EmptyCard
                    onClick={() =>
                      this.props.history.push(
                        `/tools/${this.props.skill_id}/product/new`
                      )
                    }
                  />
                </Masonry>
              </div>
            </div>
          )}
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products.products,
  loading: state.products.loading,
  skill_id: state.skills.skill.skill_id
});

const mapDispatchToProps = dispatch => {
  return {
    copyProduct: (skill_id, product_id) =>
      dispatch(copyProduct(skill_id, product_id)),
    deleteProduct: (skill_id, product_id) =>
      dispatch(deleteProduct(skill_id, product_id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);
