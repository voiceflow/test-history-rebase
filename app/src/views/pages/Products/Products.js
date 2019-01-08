import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import EditProduct from './EditProduct.js';
import ErrorModal from './../../components/Modals/ErrorModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';
import OpenSafe from './../Icons/OpenSafe.svg';
import VoiceCards from './../../components/Cards/VoiceCards';
import EmptyCard from './../../components/Cards/EmptyCard';
import MUIButton from '@material-ui/core/Button';

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
          products: [],
          loading: true,
          error: null,
          confirm: null,
          dropdownOpen: false
        }

        this.fetchProducts = this.fetchProducts.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onProductClick = this.onProductClick.bind(this)
        this.copyProduct = this.copyProduct.bind(this)
    }

    componentWillMount() {
        this.fetchProducts();
    }

    componentWillReceiveProps() {
      this.fetchProducts();
    }

    fetchProducts() {
      axios.get(`/skill/${this.props.skill_id}/products`)
      .then(res => {
          if(Array.isArray(res.data)){
              this.setState({
                  products: res.data,
                  loading: false
              })
          }else{
              this.setState({
                  loading: false
              })
          }
      })
      .catch(err => {
          console.error(err);
          this.setState({
              error: {
                  message: 'Unable to Retrieve Productss',
              },
              loading: false
          });
      })
    }
    deleteProduct(id) {
        this.setState({confirm: null});
        let products = this.state.products;
        axios.delete(`/skill/${this.props.skill_id}/product/${id}`)
        .then(()=>{
            let index = products.findIndex(p => p.id === id);
            if (index > -1) {
              products.splice(index, 1);
            }
        })
        .then(() => {
          this.setState({
              products: products
          });
        })
        .catch(err=>{
            console.error(err)
            this.setState({
                error: {
                    message: 'Unable to delete product',
                }
            });
        });
    }

    copyProduct(product_id) {
        axios.post(`/skill/${this.props.skill_id}/${product_id}/${window.user_detail.id}/copy`)
        .then(res => {
            console.log(res);
            let products = this.state.products
            let filter_products = this.state.filter_products
            products.push(res.data)
            filter_products.push(res.data)
            this.setState({
                products: products,
                filter_products: filter_products,
                error: null,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: 'Error copying product'
            })
        })
    }

    onProductClick(product_id){
      this.props.history.push(`/products/${this.props.skill_id}/template/${product_id}`);
    }

    onMouseEnter() {
      this.setState({
        dropdownOpen: true,
      })
    }

    onMouseLeave() {
      this.setState({
        dropdownOpen: false,
      })
    }

    render() {
        return(
          <div className="h-100 w-100">
              <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
              {!!this.state.confirm && <ConfirmModal
                  toggle={() => this.setState({confirm: null})}
                  confirm={this.state.confirm}
              />}
              { this.state.loading ?
                  <div className="super-center h-100 w-100">Loading...</div> :
                  <React.Fragment>
                      {this.props.secondaryPage === 'edit' ?
                        <EditProduct {...this.props}/> :
                      this.state.products.length === 0 ?
                          <div className="super-center w-100 h-100">
                            <div className="empty-container">
                              <img src={OpenSafe} alt="open safe"/>
                              <p className="empty">No Products exists</p>
                              <p className="empty-desc">Want to make racks and get rich quick? Sell dope shit within your skill and make bank</p>
                              <Link to={`/products/${this.props.skill_id}/template/new`} className="no-underline">
                                  <MUIButton varient="contained" className="purple-btn">Create a product</MUIButton>
                              </Link>
                            </div>
                          </div>
                          :
                          <div className="container my-5 pt-0">
                            {this.props.secondaryPage !== "edit" ?
                            <div className="product-header">
                              <div>
                                <p className="product-list">All Products <span className="product-list-count">({this.state.products.length})</span></p>
                              </div>
                              <Link to={`/products/${this.props.skill_id}/template/new`} className="no-underline">
                                  <MUIButton varient="contained" className="purple-btn">Create New Product</MUIButton>
                              </Link>
                            </div> :
                            null
                            }
                            <div className="products-container" style={{position: 'relative', height: '288px'}}>
                            <Masonry elementType='div' imagesLoadedOptions={{columnWidth: '200', itemSelector: ".grid-item"}}>
                                {_.map(this.state.products, product => {
                                    let icon
                                    let smallIcon = product.data.publishingInformation.locales["en-US"].smallIconUri
                                    let largeIcon = product.data.publishingInformation.locales["en-US"].largeIconUri
                                    if (!_.isNull(largeIcon)) {
                                        icon = largeIcon
                                    } else if (!_.isNull(smallIcon)) {
                                        icon = smallIcon
                                    }

                                    let name = ""
                                    if(!icon){
                                        name = product.name.match(/\b(\w)/g)
                                        if(name) { name = name.join('') }
                                        else { name = product.name }
                                        name = name.substring(0,3)
                                    }

                                    return(
                                        <VoiceCards
                                            id={product.id}
                                            icon={icon}
                                            name={product.name}
                                            onMouseEnter={this.onMouseEnter}
                                            onMouseLeave={this.onMouseLeave}
                                            dropdownOpen={this.state.dropdownOpen}
                                            placeholder={<div className='no-image card-image'><h1>{name}</h1></div>}
                                            onDelete={this.deleteProduct}
                                            onCopy={this.copyProduct}
                                            deleteLabel="Delete Product"
                                            copyLabel="Copy Product"
                                            onClick={this.onProductClick}
                                            buttonLabel="Edit Product"
                                            desc={(product.data.type === "ENTITLEMENT") ? "One-Time" : product.data.type}
                                            secondaryDesc={`$${product.data.publishingInformation.pricing["amazon.com"].defaultPriceListing.price}`}
                                        />
                                    )})}
                              <EmptyCard
                                onClick={() => this.props.history.push(`/products/${this.props.skill_id}/template/new`)}
                              />
                            </Masonry>
                          </div>
                        </div>
                      }
                  </React.Fragment>
              }
          </div>
        )
    }
}

export default Products;
