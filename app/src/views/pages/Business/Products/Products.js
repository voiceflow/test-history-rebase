import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import VoiceCards from 'views/components/Cards/VoiceCards'
import EmptyCard from 'views/components/Cards/EmptyCard'
import MUIButton from '@material-ui/core/Button'

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
          products: [],
          loading: true,
          error: null,
          dropdownOpen: false
        }

        this.fetchProducts = this.fetchProducts.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
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
          this.setState({loading: false})
          this.props.onError('Unable to Retrieve Products')
      })
    }
    deleteProduct(id) {
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
            this.props.onError('Error copying product')
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
            this.props.onError('Error copying product')
        })
    }

    onProductClick(product_id){
      this.props.history.push(`/business/${this.props.skill_id}/product/${product_id}`);
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
                    {this.state.products.length === 0 ?
                        <div className="super-center w-100 h-100">
                        <div className="empty-container">
                            <img src='/images/OpenSafe.svg' alt="open safe"/>
                            <p className="empty">No Products exists</p>
                            <p className="empty-desc">Create and Distribute In Skill Products to monetize your Skill</p>
                            <Link to={`/business/${this.props.skill_id}/product/new`} className="no-underline">
                                <MUIButton varient="contained" className="purple-btn">Create a product</MUIButton>
                            </Link>
                        </div>
                        </div>
                        :
                        <div className="px-4 mx-3 mb-5 pt-3">
                        <div className="products-container position-relative">
                        <div className="space-between w-100 px-3">
                            <h3 className="text-muted">Products</h3>
                            <Link to={`/business/${this.props.skill_id}/product/new`} className="no-underline btn purple-btn">
                                New Product
                            </Link>
                        </div>
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
                                        key={product.id}
                                        id={product.id}
                                        icon={icon}
                                        name={product.name}
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
                            <EmptyCard onClick={() => this.props.history.push(`/business/${this.props.skill_id}/product/new`)}/>
                        </Masonry>
                        </div>
                    </div>
                    }
                </React.Fragment>
          </div>
        )
    }
}

export default Products;
